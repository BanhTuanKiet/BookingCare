using System;
using System.Collections.Concurrent;

namespace server.Util
{
    public static class MemoryResetCodeStore
    {
        // Dictionary để lưu mã reset và thời gian hết hạn
        private static readonly ConcurrentDictionary<string, (string Code, DateTime ExpiryTime)> _resetCodes = 
            new ConcurrentDictionary<string, (string, DateTime)>();

        /// <summary>
        /// Lưu mã xác thực cho một email
        /// </summary>
        /// <param name="email">Email người dùng</param>
        /// <param name="code">Mã xác thực</param>
        /// <param name="expiryMinutes">Thời gian hiệu lực tính bằng phút</param>
        public static void SetCode(string email, string code, int expiryMinutes = 5)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentException("Email không được để trống", nameof(email));
            
            if (string.IsNullOrEmpty(code))
                throw new ArgumentException("Mã xác thực không được để trống", nameof(code));

            var expiryTime = DateTime.UtcNow.AddMinutes(expiryMinutes);
            _resetCodes.AddOrUpdate(email.ToLower(), (code, expiryTime), (_, _) => (code, expiryTime));
        }

        /// <summary>
        /// Xác thực mã code
        /// </summary>
        /// <param name="email">Email người dùng</param>
        /// <param name="code">Mã xác thực người dùng nhập</param>
        /// <returns>Tuple gồm kết quả và thông báo lỗi (nếu có)</returns>
        public static (bool IsValid, string ErrorMessage) VerifyCode(string email, string code)
        {
            if (string.IsNullOrEmpty(email))
                return (false, "Email không được để trống");
            
            if (string.IsNullOrEmpty(code))
                return (false, "Mã xác thực không được để trống");

            email = email.ToLower();

            // Kiểm tra xem email có trong danh sách không
            if (!_resetCodes.TryGetValue(email, out var codeData))
                return (false, "Mã xác thực không tồn tại hoặc đã hết hạn");

            // Kiểm tra thời gian hết hạn
            if (DateTime.UtcNow > codeData.ExpiryTime)
            {
                _resetCodes.TryRemove(email, out _);
                return (false, "Mã xác thực đã hết hạn");
            }

            // Kiểm tra mã code có khớp không
            if (codeData.Code != code)
                return (false, "Mã xác thực không chính xác");

            // Xóa mã sau khi xác thực thành công
            _resetCodes.TryRemove(email, out _);
            return (true, string.Empty);
        }
    }
}