using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using server.Configs;
using server.Controllers;
using server.Models;
using DotNetEnv;
using server.Middleware;
using server.Services;
using static server.Configs.AutoMapperConfig;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.AspNetCore.Mvc;
using server.Filter;
// using server.Filter;

Env.Load();

string db_server = Environment.GetEnvironmentVariable("DATABASE_SERVER");
string db_port = Environment.GetEnvironmentVariable("DATABASE_PORT");
string db_name = Environment.GetEnvironmentVariable("DATABASE_NAME");
string user_id = Environment.GetEnvironmentVariable("USER_ID");
string db_password = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");

var builder = WebApplication.CreateBuilder(args);

builder.Configuration["ConnectionStrings:DefaultConnection"] = $"Server={db_server},{db_port};Database={db_name};User Id={user_id};Password={db_password};TrustServerCertificate=True;Connect Timeout=180;";

builder.Services.AddCorsPolicy();
builder.Services.AddJWT();

// Add services to the container.
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<ISpecialty, SpecialtyServices>();
builder.Services.AddScoped<IService,  ServiceServices>();
builder.Services.AddScoped<IDoctor, DoctorServices>();
// builder.Services.AddScoped<SignInManager<ApplicationUser>>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ClinicManagementContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5, // Số lần thử lại
            maxRetryDelay: TimeSpan.FromSeconds(10), // Độ trễ tối đa giữa các lần thử
            errorNumbersToAdd: null)
    )
);

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<ClinicManagementContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
    options.ModelMetadataDetailsProviders.Add(new SystemTextJsonValidationMetadataProvider());
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddAutoMapper(typeof(AutoMapperConfig));
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("_allowSpecificOrigins");
// Add errohandling middlware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// // Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
//    app.UseSwagger();
//    app.UseSwaggerUI();
}
app.UseRouting();
// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();