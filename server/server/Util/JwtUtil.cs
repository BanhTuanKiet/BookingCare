using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using server.Models;

namespace server.Util
{
    public static class JwtUtil
    {
        public static string GenerateToken(ApplicationUser user, int timeExp, IConfiguration _configuration)
        {
            var key = Encoding.UTF8.GetBytes("MộtPassphraseDàiÍtNhất32KýTự1234567890");
            Console.WriteLine(key);
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, "BanhTuanKiet"),
                new Claim(ClaimTypes.Email, "kiet2908@gmail.com"),
                new Claim(ClaimTypes.Role, "doctor")
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(timeExp),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string jwtToken = tokenHandler.WriteToken(token);

            return jwtToken;
        }
    }
}