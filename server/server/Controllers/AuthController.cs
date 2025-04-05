using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
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
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ClinicManagementContext _context;

        public AuthController(ClinicManagementContext context, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _configuration = configuration;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpGet("getUserRoles")]
        public async Task<ActionResult> GetUserRoles()
        {
            var cookies = Request.Cookies;
            var token = cookies["token"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Convert.FromBase64String("uXyK3Y2Uaxr6wB8s9WcRfDj1pQ8zLt0N9KzE4fWvMbA=");

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            // var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);
            // var userEmail = jwtToken.Claims.First(x => x.Type == "email").Value;
            var userRole = jwtToken.Claims.First(x => x.Type == "role").Value;
            var roles = await _userManager.GetRolesAsync(new ApplicationUser { Id = 22 });
            var email = jwtToken.Claims.First(x => x.Type == "email").Value;
            Console.WriteLine($"UserRole: {userRole} User Email: {email}");
            return Ok( new { roles = roles, message = "Lấy danh sách role thành công!" });
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

            string jwtToken = JwtUtil.GenerateToken(user, 1, _configuration);

            CookieUtil.SetCookie(Response, "token", jwtToken, 1);

            var role = await _userManager.GetRolesAsync(user);

            return Ok(new { message = "Đăng nhập thành công!" , UserName = user.UserName, role = role, jwtToken = jwtToken });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistryForm user)
        {
            // Kiểm tra email đã tồn tại chưa
            var existUser = await _signInManager.UserManager.FindByEmailAsync(user.email);
            if (existUser != null)
            {
               throw new ErrorHandlingException("Email đã tồn tại!!" );
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
                throw new ErrorHandlingException ("Đăng ký không thành công");
            }

            await _signInManager.SignInAsync(newUser, isPersistent: false);

            return Ok(new { message = "Đăng ký thành công!", user = newUser.Email });
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
