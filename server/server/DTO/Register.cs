using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class RegisterForm
{
    [Required(ErrorMessage = "Tên không được để trống!")]
    public string? UserName { get; set; }
    [Required(ErrorMessage = "Email không được để trống!")]
    public string? Email { get; set; }
    [Required(ErrorMessage = "Số điện thoại không được để trống!")]
    public string? PhoneNumber { get; set; }
    [Required(ErrorMessage = "Mật khẩu không được để trống!")]
    public string? Password { get; set; }
    [Required(ErrorMessage = "Vui lòng xác nhận lại mật khẩu!")]
    [Compare("Password", ErrorMessage = "Mật khẩu không khớp!")]
    public string? ConfirmPassword { get; set; }
}

