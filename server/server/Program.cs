using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using server.Configs;
using server.Controllers;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add cors policy

builder.Services.AddCorsPolicy();
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//};

app.UseCors("_allowSpecificOrigins");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
