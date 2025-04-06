using System.Collections;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace server.DTO
{
    public class RegistryForm
    {
        [Required(ErrorMessage = "Email không được để trống!")]
        [EmailAddress(ErrorMessage = "Vui lòng nhập đúng định dạng!")]
        public string? email { get; set; }

        [Required(ErrorMessage = "Họ và tên không được để trống!")]
        public string? fullname { get; set; }

        [Required(ErrorMessage = "Password không được để trống!")]
        [MinLength(6, ErrorMessage = "Password tối thiểu 6 ký tự!")]
        // [DataType(DataType.Password)]
        // [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$",
        //     ErrorMessage = "Password phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 số!")]
        public string? password { get; set; }

        [Required(ErrorMessage = "Password không được để trống!")]
        [Compare(nameof(password), ErrorMessage = "Password xác nhận không khớp!")]
        public string? passwordConfirmed { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống!")]
        [Phone(ErrorMessage = "Số điện thoại chỉ bao gồm chữ số!")]
        public string? phone { get; set; }
    }
}