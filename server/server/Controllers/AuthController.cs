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

        public AuthController(
            ClinicManagementContext context,
            IConfiguration configuration,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IEmailService emailService
        )

        {
            _context = context;
            _configuration = configuration;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
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
            if (!OtpUtil.CanGenerateNewOtp(request.Email))
                return BadRequest(new { message = "Vui lòng đợi 1 phút trước khi yêu cầu OTP mới!" });

            // Tạo và lưu OTP mới
            var otp = OtpUtil.GenerateOtp();
            OtpUtil.StoreOtp(request.Email, otp);

            // Gửi OTP qua email
            bool emailSent = await OtpUtil.SendOtpEmail(request.Email, otp, _configuration);
            
            if (!emailSent)
                return StatusCode(500, new { message = "Không thể gửi mã OTP. Vui lòng thử lại sau." });
            
            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn!" });
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

            // Xác thực OTP
            if (!OtpUtil.ValidateOtp(user.email, user.otp))
            {
                // Kiểm tra số lần thử và xử lý
                if (OtpUtil.MaxAttemptsReached(user.email))
                {
                    OtpUtil.RemoveOtp(user.email);
                    return BadRequest(new { message = "Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu mã mới!" });
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

            // Xóa OTP sau khi đã sử dụng thành công
            OtpUtil.RemoveOtp(user.email);

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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return BadRequest("Email không tồn tại");

            // Tạo và lưu OTP
            var otp = OtpUtil.GenerateOtp();
            OtpUtil.StoreOtp(request.Email, otp);

            // Gửi OTP qua email
            bool emailSent = await OtpUtil.SendOtpEmail(request.Email, otp, _configuration);
            
            if (!emailSent)
                return StatusCode(500, new { message = "Không thể gửi mã OTP. Vui lòng thử lại sau." });

            return Ok("Đã gửi mã xác thực đến email");
        }

        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) throw new ErrorHandlingException(400, "Email không tồn tại");


            if (!OtpUtil.ValidateOtp(request.Email, request.Code))
            {
                // Kiểm tra số lần thử và xử lý
                if (OtpUtil.MaxAttemptsReached(request.Email))
                {
                    OtpUtil.RemoveOtp(request.Email);
                    return BadRequest(new { message = "Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu mã mới!" });
                }
                return BadRequest(new { message = "Mã OTP không hợp lệ hoặc đã hết hạn!" });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            OtpUtil.RemoveOtp(request.Email);

            if (!result.Succeeded) throw new ErrorHandlingException(500, "Lỗi khi đặt lại mật khẩu");

            return Ok("Đặt lại mật khẩu thành công");
        }

    }
}