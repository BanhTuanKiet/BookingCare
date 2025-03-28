using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace server.Configs
{
    public static class JWTConfigs
    {
        public static void AddJWT(this IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = "http://127.0.0.1:5140",
                        ValidAudience = "http://127.0.0.1:3000",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("uX9#2fB!rT7z$KpV@8dG%qL*eJ4mW!sN^ZbC@1yH"))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnChallenge = async context =>
                        {
                            context.HandleResponse();
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";

                            var response = new { message = "Bạn chưa đăng nhập hoặc token không hợp lệ!" };
                            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                        },

                        OnForbidden = async context =>
                        {
                            context.Response.StatusCode = 403;
                            context.Response.ContentType = "application/json";

                            var response = new { message = "Bạn không có quyền truy cập API này!" };
                            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                        }
                    };
                });
        }
    }
}
