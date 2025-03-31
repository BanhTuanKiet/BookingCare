using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.DTO;
using server.Middleware;
using server.Models;

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

        public AuthController(ClinicManagementContext context, IConfiguration configuration, 
                            SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _configuration = configuration;
            _signInManager = signInManager;
            _userManager = userManager;
        }



        [HttpPost("Signin")]
        public async Task<IActionResult> Signin([FromBody] SigninForm login)
        {
            Console.WriteLine($"Login attempt: {JsonSerializer.Serialize(login)}");

            if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin!" });
            }

            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user == null)
            {
                Console.WriteLine($"Không tìm thấy user: {login.Email}");
                return Unauthorized(new { message = "Tài khoản không tồn tại!" });
            }

            // Kiểm tra mật khẩu
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, login.Password);
            if (!isPasswordValid)
            {
                Console.WriteLine($"Sai mật khẩu: {login.Email}");
                return Unauthorized(new { message = "Sai mật khẩu!" });
            }

            // Tạo JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, "user")
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string jwtToken = tokenHandler.WriteToken(token);

            // Lưu token vào HttpOnly Cookie
            Response.Cookies.Append("AuthToken", jwtToken, new CookieOptions
            {
                HttpOnly = true,  // Ngăn JavaScript truy cập cookie
                Secure = true,    // Chỉ gửi qua HTTPS (bật trong môi trường production)
                SameSite = SameSiteMode.Strict, // Bảo vệ CSRF
                Expires = DateTime.UtcNow.AddHours(1) // Hết hạn cùng thời gian với token
            });

            Console.WriteLine($"Đăng nhập thành công: {login.Email}");
            return Ok(new { message = "Đăng nhập thành công!" });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistryForm user)
        {
            Console.WriteLine($"UserName: {user.fullname}");
            Console.WriteLine($"PhoneNumber: {user.phone}");
            Console.WriteLine($"Email: {user.email}");

            // Kiểm tra nếu email hoặc username bị null
            if (string.IsNullOrEmpty(user.email) || string.IsNullOrEmpty(user.fullname))
            {
                return BadRequest(new { message = "Tên đăng nhập và email không được để trống!" });
            }

            // Kiểm tra email đã tồn tại chưa
            var existUser = await _signInManager.UserManager.FindByEmailAsync(user.email);
            if (existUser != null)
            {
                return BadRequest(new { message = "Email đã tồn tại!!" });
            }

            // Kiểm tra xác nhận mật khẩu
            if (user.password != user.passwordConfirmed)
            {
                return BadRequest(new { message = "Mật khẩu hoặc Xác nhận mật khẩu không đúng!!!" });
            }

            // Tạo tài khoản mới, dùng Email làm Username
            var newUser = new ApplicationUser
            {
                UserName = user.fullname,
                Email = user.email,
                PhoneNumber = user.phone
            };

            // Thử tạo tài khoản
            var result = await _signInManager.UserManager.CreateAsync(newUser, user.password);

            if (!result.Succeeded)
            {
                Console.WriteLine("Lỗi khi tạo tài khoản:");
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Code: {error.Code}, Mô tả: {error.Description}");
                }
                return BadRequest(new { message = "Đăng ký không thành công", errors = result.Errors });
            }

            Console.WriteLine($"Tài khoản {user.email} đã được tạo thành công!");

            // Nếu có xác thực email, không đăng nhập ngay
            //if (_signInManager.Options.SignIn.RequireConfirmedEmail)
            //{
            //    return Ok(new { message = "Đăng ký thành công! Vui lòng xác thực email trước khi đăng nhập." });
            //}

            // Đăng nhập ngay sau khi đăng ký (có thể không cần nếu yêu cầu xác thực email)
            await _signInManager.SignInAsync(newUser, isPersistent: false);

            return Ok(new { message = "Đăng ký thành công!", user = newUser.Email });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login()
        {
            Console.WriteLine(">>> API Signin được gọi");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("uX9#2fB!rT7z$KpV@8dG%qL*eJ4mW!sN^ZbC@1yH");
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, "ưegwge"),
            new Claim("email", "nguyenvana@gmail.com"),
            new Claim(ClaimTypes.Role, "admin") // Nếu muốn thêm role
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = "http://127.0.0.1:5140",
                Audience = "http://127.0.0.1:3000",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { token = tokenHandler.WriteToken(token) });
        }


        [Authorize(Roles = "doctor")]
        [HttpPost("auth_user")]
        public async Task<IActionResult> AuthUser([FromBody] LoginForm user)
        {
            // string nameValue = data.GetProperty("ưegwe").GetString();

            // if (string.IsNullOrEmpty(nameValue)){
            //     throw new ErrorHandlingException(400, "name is null!");
            // }
            // Console.WriteLine($"Name: {nameValue}");
            // return Ok(new { Token = "HttpContext", message = "Xác thực thành công", name = nameValue });

            Console.WriteLine($"User: {user.Email} - {user.Password}");

            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password)) {
                throw new ErrorHandlingException(400, "Vui lòng nhập đủ thông tin!");
            }
            
            return Ok(new { Token = "HttpContext", message = "Xác thực thành công", user = user });
        }

    }
}
