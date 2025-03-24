using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using server.Configs;
using server.Controllers;
using server.Models;
using DotNetEnv;
using server.Middleware;

Env.Load();

string db_server = Environment.GetEnvironmentVariable("DATABASE_SERVER");
string db_port = Environment.GetEnvironmentVariable("DATABASE_PORT");
string db_name = Environment.GetEnvironmentVariable("DATABASE_NAME");
string user_id = Environment.GetEnvironmentVariable("USER_ID");
string db_password = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");

var builder = WebApplication.CreateBuilder(args);

builder.Configuration["ConnectionStrings:DefaultConnection"] = $"Server={db_server},{db_port};Database={db_name};User Id={user_id};Password={db_password};TrustServerCertificate=True;Connect Timeout=180;";

// Add cors policy

builder.Services.AddCorsPolicy();
// builder.Services.AddJWT();
// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ClinicManagementContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5, // Số lần thử lại
            maxRetryDelay: TimeSpan.FromSeconds(10), // Độ trễ tối đa giữa các lần thử
            errorNumbersToAdd: null)
    )
);


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("_allowSpecificOrigins");
// Add errohandling middlware
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<AuthToken>();
// app.UseWhen(context => 

// )
// // Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
//    app.UseSwagger();
//    app.UseSwaggerUI();
}
app.UseRouting();
// app.UseHttpsRedirection();
// app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
