using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace server.Util
{
    public class OtpUtil
    {
        // Lưu trữ OTP tạm thời theo email
        private static readonly Dictionary<string, OtpInfo> _otpDictionary = new Dictionary<string, OtpInfo>();

        public class OtpInfo
        {
            public string Code { get; set; }
            public DateTime ExpiryTime { get; set; }
            public int AttemptCount { get; set; }
        }

        // Tạo mã OTP ngẫu nhiên 6 chữ số
        public static string GenerateOtp()
        {
            using var rng = RandomNumberGenerator.Create();
            byte[] data = new byte[4];
            rng.GetBytes(data);
            int value = BitConverter.ToInt32(data, 0) & 0x7FFFFFFF;
            return (value % 1000000).ToString("D6"); // 6 chữ số
        }

        // Thêm hoặc cập nhật OTP cho một email
        public static void StoreOtp(string email, string otp, int expiryMinutes = 5)
        {
            _otpDictionary[email] = new OtpInfo
            {
                Code = otp,
                ExpiryTime = DateTime.Now.AddMinutes(expiryMinutes),
                AttemptCount = 0
            };
        }

        // Kiểm tra xem có thể tạo OTP mới hay không (rate limiting)
        public static bool CanGenerateNewOtp(string email)
        {
            if (_otpDictionary.TryGetValue(email, out var existingOtp))
            {
                var timeSinceLastRequest = DateTime.Now - existingOtp.ExpiryTime.AddMinutes(-5);
                return timeSinceLastRequest.TotalMinutes >= 1;
            }
            return true;
        }

        // Xác thực OTP
        public static bool ValidateOtp(string email, string otp)
        {
            if (!_otpDictionary.TryGetValue(email, out var otpInfo))
                return false;

            if (otpInfo.Code != otp || DateTime.Now > otpInfo.ExpiryTime)
            {
                otpInfo.AttemptCount++;
                return false;
            }

            return true;
        }

        // Kiểm tra số lần thử
        public static int GetAttemptCount(string email)
        {
            if (_otpDictionary.TryGetValue(email, out var otpInfo))
            {
                return otpInfo.AttemptCount;
            }
            return 0;
        }

        // Tăng số lần thử
        public static void IncrementAttemptCount(string email)
        {
            if (_otpDictionary.TryGetValue(email, out var otpInfo))
            {
                otpInfo.AttemptCount++;
            }
        }

        // Xóa OTP khi đã sử dụng xong
        public static void RemoveOtp(string email)
        {
            if (_otpDictionary.ContainsKey(email))
            {
                _otpDictionary.Remove(email);
            }
        }

        // Kiểm tra xem email có OTP đang hoạt động không
        public static bool HasActiveOtp(string email)
        {
            return _otpDictionary.TryGetValue(email, out var otpInfo) && 
                  DateTime.Now <= otpInfo.ExpiryTime;
        }

        // Gửi email OTP
        public static async Task<bool> SendOtpEmail(string email, string otp, IConfiguration configuration)
        {
            try
            {
                var smtpClient = new SmtpClient
                {
                    Host = configuration["EmailSettings:SmtpServer"],
                    Port = int.Parse(configuration["EmailSettings:Port"]),
                    EnableSsl = bool.Parse(configuration["EmailSettings:EnableSsl"]),
                    Credentials = new System.Net.NetworkCredential(
                        configuration["EmailSettings:SenderEmail"],
                        configuration["EmailSettings:Password"]
                    )
                };

                var message = new MailMessage
                {
                    From = new MailAddress(configuration["EmailSettings:SenderEmail"], configuration["EmailSettings:SenderName"]),
                    Subject = "Mã xác thực đăng ký tài khoản",
                    Body = $@"
                        <html>
                        <body>
                            <h2>Mã xác thực đăng ký tài khoản</h2>
                            <p>Xin chào,</p>
                            <p>Mã OTP của bạn là: <strong>{otp}</strong></p>
                            <p>Mã này có hiệu lực trong vòng 5 phút.</p>
                            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                            <p>Trân trọng,<br/>Hệ thống đặt lịch khám bệnh</p>
                        </body>
                        </html>",
                    IsBodyHtml = true
                };

                message.To.Add(email);
                await smtpClient.SendMailAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi gửi email: {ex.Message}");
                return false;
            }
        }

        // Kiểm tra quá số lần thử
        public static bool MaxAttemptsReached(string email, int maxAttempts = 3)
        {
            if (_otpDictionary.TryGetValue(email, out var otpInfo))
            {
                return otpInfo.AttemptCount >= maxAttempts;
            }
            return false;
        }

         // Hàm gửi email cho reset password, tách riêng để đổi Subject/Body
        public static async Task<bool> SendResetPasswordEmail(string email, string otp, IConfiguration configuration)
        {
            try
            {
                var smtpClient = new SmtpClient
                {
                    Host = configuration["EmailSettings:SmtpServer"],
                    Port = int.Parse(configuration["EmailSettings:Port"]),
                    EnableSsl = bool.Parse(configuration["EmailSettings:EnableSsl"]),
                    Credentials = new NetworkCredential(
                        configuration["EmailSettings:SenderEmail"],
                        configuration["EmailSettings:Password"]
                    )
                };

                var message = new MailMessage
                {
                    From = new MailAddress(configuration["EmailSettings:SenderEmail"], configuration["EmailSettings:SenderName"]),
                    Subject = "Mã xác thực đổi mật khẩu",
                    Body = $@"
                        <html>
                        <body>
                            <h2>Mã xác thực đổi mật khẩu</h2>
                            <p>Mã OTP của bạn là: <strong>{otp}</strong></p>
                            <p>Mã này có hiệu lực trong vòng 5 phút.</p>
                            <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
                            <p>Trân trọng,<br/>Hệ thống</p>
                        </body>
                        </html>",
                    IsBodyHtml = true
                };

                message.To.Add(email);
                await smtpClient.SendMailAsync(message);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}