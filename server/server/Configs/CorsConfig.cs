using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace server.Configs
{
    public static class CorsConfig
    {
        public static void AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("_allowSpecificOrigins", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                          //.AllowCredentials();
                });
            });
        }
    }
}
