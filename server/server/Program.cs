using Microsoft.EntityFrameworkCore;
using server.Configs;
using server.Controllers;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add cors policy

builder.Services.AddCorsPolicy();
// Add services to the container.

builder.Services.AddDbContext<ClinicManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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
