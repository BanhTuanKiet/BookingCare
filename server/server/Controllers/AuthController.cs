using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Util;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ClinicManagementContext _context;

        public AuthController(ClinicManagementContext context, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _context = context;
            _configuration = configuration;
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("Signin")]
        public async Task<IActionResult> Signin([FromBody] SigninForm login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email) ?? throw new ErrorHandlingException(400, "Tài khoản không tồn tại!");
            
            // Kiểm tra mật khẩu
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, login.Password);

            if (!isPasswordValid)
            {
                Console.WriteLine($"Sai mật khẩu: {login.Email}");
                throw new ErrorHandlingException(400, "Sai mật khẩu!");
            }
            
            IList<string> roles = await _userManager.GetRolesAsync(user);

            string jwtToken = JwtUtil.GenerateToken(user, roles, 1, _configuration);
        
            CookieUtil.SetCookie(Response, "token", jwtToken, 1);

            return Ok(new { message = "Đăng nhập thành công!" , UserName = user.UserName });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistryForm user)
        {
            var existUser = await _signInManager.UserManager.FindByEmailAsync(user.email);
            if (existUser != null)
            {
                throw new ErrorHandlingException(400, "Email đã tồn tại!!");
            }

            var newUser = new ApplicationUser
            {
                UserName = user.email, // hoặc bất kỳ định danh duy nhất nào bạn chọn
                Email = user.email,
                PhoneNumber = user.phone,
                FullName = user.fullname // map vào cột bạn vừa thêm
            };

            var result = await _signInManager.UserManager.CreateAsync(newUser, user.password);
            if (!result.Succeeded)
            {
                // Console.WriteLine("Lỗi khi tạo tài khoản:");
                var firstError = result.Errors.FirstOrDefault();
                if (firstError != null)
                {
                    Console.WriteLine($"Code: {firstError.Code}, Mô tả: {firstError.Description}");
                    throw new ErrorHandlingException(400, firstError.Description);
                }

                // throw new ErrorHandlingException ("Đăng ký không thành công");
            }

            // Biết chắc roleId = 3 là "patient"
            _context.Add(new IdentityUserRole<int>
            {
                UserId = newUser.Id,
                RoleId = 3
            });
            await _context.SaveChangesAsync();

            await _signInManager.SignInAsync(newUser, isPersistent: false);

            return Ok(new { message = "Đăng ký thành công" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login()
        {
            Console.WriteLine(">>> API Signin được gọi");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("L1vxy4pDz1S6Q5z5X2C3HnA8YbZxJ7pLfX5Kg4Z4pT8=");
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

            Console.WriteLine($"User: {user.Email} - {user.Password}");

            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password)) {
                throw new ErrorHandlingException(400, "Vui lòng nhập đủ thông tin!");
            }
            
            return Ok(new { Token = "HttpContext", message = "Xác thực thành công", user = user });
        }

    }
}
