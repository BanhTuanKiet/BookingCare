using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Util;
using System.Net;
using System.Net.Mail;


namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ClinicManagementContext _context;
        private readonly IEmailService _emailService;


        public AuthController(ClinicManagementContext context, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, IEmailService emailService)

        // Lưu trữ OTP tạm thời theo email
        private static readonly Dictionary<string, OtpInfo> _otpDictionary = new Dictionary<string, OtpInfo>();

        public AuthController(
            ClinicManagementContext context,
            IConfiguration configuration,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)

        {
            _context = context;
            _configuration = configuration;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
        }

        private class OtpInfo
        {
            public string Code { get; set; }
            public DateTime ExpiryTime { get; set; }
            public int AttemptCount { get; set; }
        }

        private string GenerateOtp()
        {
            using var rng = RandomNumberGenerator.Create();
            byte[] data = new byte[4];
            rng.GetBytes(data);
            int value = BitConverter.ToInt32(data, 0) & 0x7FFFFFFF;
            return (value % 1000000).ToString("D6"); // 6 chữ số
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOTP([FromBody] SendOtpRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                throw new ErrorHandlingException(400, "Vui lòng nhập email!");

            try
            {
                var mailAddress = new MailAddress(request.Email); // validate email
            }
            catch
            {
                throw new ErrorHandlingException(400, "Email không hợp lệ!");
            }

            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
                throw new ErrorHandlingException(400, "Email đã tồn tại trong hệ thống!");

            // Kiểm tra và rate-limit OTP
            if (_otpDictionary.TryGetValue(request.Email, out var existingOtp))
            {
                var timeSinceLastRequest = DateTime.Now - existingOtp.ExpiryTime.AddMinutes(-5);
                if (timeSinceLastRequest.TotalMinutes < 1)
                    return BadRequest(new { message = "Vui lòng đợi 1 phút trước khi yêu cầu OTP mới!" });

                if (DateTime.Now > existingOtp.ExpiryTime)
                    _otpDictionary.Remove(request.Email);
            }

            // Gửi OTP
            var otp = GenerateOtp();
            _otpDictionary[request.Email] = new OtpInfo
            {
                Code = otp,
                ExpiryTime = DateTime.Now.AddMinutes(5),
                AttemptCount = 0
            };

            var smtpClient = new SmtpClient
            {
                Host = _configuration["EmailSettings:SmtpServer"],
                Port = int.Parse(_configuration["EmailSettings:Port"]),
                EnableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]),
                Credentials = new System.Net.NetworkCredential(
                    _configuration["EmailSettings:SenderEmail"],
                    _configuration["EmailSettings:Password"]
                )
            };

            var message = new MailMessage
            {
                From = new MailAddress(_configuration["EmailSettings:SenderEmail"], _configuration["EmailSettings:SenderName"]),
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

            message.To.Add(request.Email);

            try
            {
                await smtpClient.SendMailAsync(message);
                return Ok(new { message = "Mã OTP đã được gửi đến email của bạn!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi gửi email: {ex.Message}");
                return StatusCode(500, new { message = "Không thể gửi mã OTP. Vui lòng thử lại sau." });
            }
        }

        [HttpPost("signin")]
        public async Task<IActionResult> Signin([FromBody] SigninForm login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email)
                        ?? throw new ErrorHandlingException(400, "Tài khoản không tồn tại!");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, login.Password);
            if (!isPasswordValid)
                throw new ErrorHandlingException(400, "Sai mật khẩu!");

            var roles = await _userManager.GetRolesAsync(user);
            var token = JwtUtil.GenerateToken(user, roles, 1, _configuration);
            CookieUtil.SetCookie(Response, "token", token, 1);

            return Ok(new { message = "Đăng nhập thành công!", userName = user.FullName, role = roles[0] });
        }

        private async Task<ApplicationUser?> FindUserByPhoneNumberAsync(string phoneNumber)
        {
            return await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistryForm user)
        {
            if (string.IsNullOrEmpty(user.otp))
                return BadRequest(new { message = "Vui lòng nhập mã OTP!" });

            if (!_otpDictionary.TryGetValue(user.email, out var otpInfo) ||
                otpInfo.Code != user.otp || DateTime.Now > otpInfo.ExpiryTime)
            {
                if (otpInfo != null)
                {
                    otpInfo.AttemptCount++;
                    if (otpInfo.AttemptCount >= 3)
                    {
                        _otpDictionary.Remove(user.email);
                        return BadRequest(new { message = "Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu mã mới!" });
                    }
                }
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn!" });
            }

            var existUser = await _userManager.FindByEmailAsync(user.email);
            var existPhone = await FindUserByPhoneNumberAsync(user.phone);

            if (existUser != null)
                throw new ErrorHandlingException(400, "Email đã tồn tại!");

            if (existPhone != null)
                throw new ErrorHandlingException(400, "Số điện thoại đã được sử dụng!");

            var newUser = new ApplicationUser
            {
                UserName = user.email,
                Email = user.email,
                PhoneNumber = user.phone,
                FullName = user.fullname
            };

            var result = await _userManager.CreateAsync(newUser, user.password);
            if (!result.Succeeded)
            {
                var firstError = result.Errors.FirstOrDefault();
                throw new ErrorHandlingException(400, firstError?.Description ?? "Đăng ký thất bại");
            }

            await _context.UserRoles.AddAsync(new IdentityUserRole<int>
            {
                UserId = newUser.Id,
                RoleId = 3 // role bệnh nhân
            });

            await _context.Patients.AddAsync(new Patient { UserId = newUser.Id });
            await _context.SaveChangesAsync();

            _otpDictionary.Remove(user.email);

            return Ok(new { message = "Đăng ký thành công!", user = newUser.Email });
        }

        [HttpPost("login-demo")]
        public IActionResult LoginDemo()
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("L1vxy4pDz1S6Q5z5X2C3HnA8YbZxJ7pLfX5Kg4Z4pT8=");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, "Nguyen Van A"),
                    new Claim("email", "nguyenvana@gmail.com"),
                    new Claim(ClaimTypes.Role, "admin")
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = "http://localhost",
                Audience = "http://localhost:3000"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { token = tokenHandler.WriteToken(token) });
        }

        [Authorize(Roles = "doctor")]
        [HttpPost("auth_user")]
        public IActionResult AuthUser([FromBody] LoginForm user)
        {
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
                throw new ErrorHandlingException(400, "Vui lòng nhập đủ thông tin!");

            return Ok(new { Token = "HttpContext", message = "Xác thực thành công", user });
        }
    }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return BadRequest("Email không tồn tại");

            var code = new Random().Next(100000, 999999).ToString();

            // Lưu mã vào DB hoặc gửi ngay tới email
            await _emailService.SendEmailAsync(user.Email, "Mã khôi phục mật khẩu", $"Mã xác nhận của bạn là: {code}");

            // Có thể lưu mã + thời gian hết hạn vào DB để xác nhận sau

            MemoryResetCodeStore.SetCode(user.Email, code, 5);

            return Ok("Đã gửi mã xác thực đến email");
        }

        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) throw new ErrorHandlingException(400, "Email không tồn tại");

            var (isValid, error) = MemoryResetCodeStore.VerifyCode(request.Email, request.Code);
            if (!isValid) throw new ErrorHandlingException(400,error);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (!result.Succeeded) throw new ErrorHandlingException(500, "Lỗi khi đặt lại mật khẩu");

            return Ok("Đặt lại mật khẩu thành công");
        }


    public class SendOtpRequest
    {
        public string Email { get; set; }

    }
}
