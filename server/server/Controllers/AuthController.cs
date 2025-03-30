using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Middleware;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ClinicManagementContext _context;

        public AuthController(ClinicManagementContext context, IConfiguration configuration, SignInManager<ApplicationUser> signInManager)
        {
            _context = context;
            _configuration = configuration;
            _signInManager = signInManager;
        }


        [HttpPost("signin")]
        public async Task<ActionResult> Signin()
        {
            var user = new { email = "sedfsdf", password = "aefwe" };
            return Ok(user);
        }

        [HttpGet("login")]
        public async Task<IActionResult> Login()
        {
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

            Console.WriteLine($"User: {user.Email} - {user.Password}");

            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password)) {
                throw new ErrorHandlingException(400, "Vui lòng nhập đủ thông tin!");
            }
            
            return Ok(new { Token = "HttpContext", message = "Xác thực thành công", user = user });
        }

        [HttpPost("demo_signin")]
        public async Task<IActionResult> OnPostAsync([FromBody] LoginForm input)
        {
            //if (!ModelState.IsValid)
            //{
            //    var message = string.Join(" | ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));

            //    return Ok( new { error = message });                     
            //}

            return Ok( new { email = input.Email, password = input.Password });         
        }
    }
}
