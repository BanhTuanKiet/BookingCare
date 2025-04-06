using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NuGet.Protocol;

namespace server.Configs
    {
        public static class JWTConfigs
        {
            public static void AddJWT(this IServiceCollection services)
            {
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
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
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("MộtPassphraseDàiÍtNhất32KýTự1234567890"))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            Console.WriteLine("📩 OnMessageReceived triggered");
                            var token = context.Request.Cookies["token"];
                            Console.WriteLine($"Token from cookie: {token}");   
                            if (!string.IsNullOrEmpty(token))
                            {
                                context.Token = token;
                            }
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = context =>
                        {
                            Console.WriteLine("✅ OnTokenValidated triggered");
                            var token = context.Request.Cookies["token"];

                            if (!string.IsNullOrEmpty(token))
                            {
                                var jwtHandler = new JwtSecurityTokenHandler();
                                var jwtToken = jwtHandler.ReadJwtToken(token);

                                if (jwtToken != null && jwtToken.Claims != null)
                                {
                                    var nameIdClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "nameid");

                                    if (nameIdClaim != null)
                                    {
                                        string userId = nameIdClaim.Value;
                                        Console.WriteLine($"nameIdClaim from token: {nameIdClaim}");

                                        context.HttpContext.Items["UserId"] = userId;
                                    }
                                }
                            }
                            return Task.CompletedTask;
                        },
                        OnForbidden = async context =>
                        {
                            Console.WriteLine("⛔ OnForbidden triggered");
                            context.Response.StatusCode = 403;
                            context.Response.ContentType = "application/json";

                            var response = new { ErrorMessage = "Bạn không có quyền truy cập API này!" };
                            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                        },

                        OnChallenge = async context =>
                        {
                            Console.WriteLine("⚠️ OnChallenge triggered");
                            context.HandleResponse();
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";

                            var token = context.Request.Cookies["token"];
                            var ErrorMessage = string.IsNullOrEmpty(token) ? "Vui lòng đăng nhập để tiếp tục!" : "Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại!";
                            var response = new { ErrorMessage };
                            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                        },
                    };
                });
            }
        }
    }