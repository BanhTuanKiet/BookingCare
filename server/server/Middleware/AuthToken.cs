using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace server.Middleware
{
    public class AuthToken
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuthToken> _logger;

        public AuthToken(RequestDelegate next, ILogger<AuthToken> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            Console.WriteLine("AAAAAAAAAAAAAAAAAAA", context.Request);
            //var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            //if (token != null)
            //    AttachUserToContext(context, token);

            //await _next(context);
        }

        private void AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                //var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                var key = Encoding.ASCII.GetBytes("uX9#2fB!rT7z$KpV@8dG%qL*eJ4mW!sN^ZbC@1yH");

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                // context.Items["User"] = userService.GetById(userId);
                context.Items["User"] = "1";
            }

            catch
            {
                // do nothing
            }
        }
    }
}
