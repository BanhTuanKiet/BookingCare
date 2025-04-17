using System.Collections;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace server.DTO {
    // DTO cho yêu cầu quên mật khẩu
    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }
}

