using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using DotNetEnv;
using server.Configs;
using server.Middleware;
using server.Services;
using server.Services.RatingRepository;
using server.Filter;
using server.Models;
using System.Text;

// ----------------------------------------------------
// LOAD .env
// ----------------------------------------------------
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// ----------------------------------------------------
// ĐỌC BIẾN MÔI TRƯỜNG TỪ .env
// ----------------------------------------------------
string dbServer = Environment.GetEnvironmentVariable("DATABASE_SERVER");
string dbName = Environment.GetEnvironmentVariable("DATABASE_NAME");
string trusted = Environment.GetEnvironmentVariable("TRUSTED_CONNECTION") ?? "True";
string mars = Environment.GetEnvironmentVariable("MULTIPLEACTIVE_RESULTSETS") ?? "True";

// ----------------------------------------------------
// TẠO CONNECTION STRING
// ----------------------------------------------------
string connectionString =
    $"Server={dbServer};Database={dbName};Trusted_Connection={trusted};" +
    $"MultipleActiveResultSets={mars};TrustServerCertificate=True;";

// Gán vào cấu hình
builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;

// ----------------------------------------------------
// ĐĂNG KÝ SERVICE
// ----------------------------------------------------
builder.Services.AddCorsPolicy();
builder.Services.AddHttpClient();
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddScoped<ISpecialty, SpecialtyServices>();
builder.Services.AddScoped<IService, ServiceServices>();
builder.Services.AddScoped<IUser, UserServices>();
builder.Services.AddScoped<IDoctor, DoctorServices>();
builder.Services.AddScoped<IPatient, PatientServices>();
builder.Services.AddScoped<IAppointment, AppointmentServices>();
builder.Services.AddScoped<IMedicine, MedicineService>();
builder.Services.AddScoped<IMedicalRecord, MedicalRecordService>();
builder.Services.AddScoped<IAuth, AuthServices>();
builder.Services.AddScoped<IReview, ReviewServices>();
builder.Services.AddScoped<IContact, ContactServices>();

// MOMO
builder.Services.AddOptions<MomoOptionModel>()
    .Bind(builder.Configuration.GetSection("MomoAPI"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

// ----------------------------------------------------
// ENTITY FRAMEWORK + SQL SERVER
// ----------------------------------------------------
builder.Services.AddDbContext<ClinicManagementContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
        sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)
    )
);

// ----------------------------------------------------
// ASP.NET IDENTITY
// ----------------------------------------------------
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<ClinicManagementContext>()
    .AddDefaultTokenProviders();

// JWT
builder.Services.AddJWT();

// ----------------------------------------------------
// MVC + VALIDATION
// ----------------------------------------------------
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
    options.ModelMetadataDetailsProviders.Add(new SystemTextJsonValidationMetadataProvider());
});

// SWAGGER + API DOC
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

var app = builder.Build();

// ----------------------------------------------------
// MIDDLEWARE PIPELINE
// ----------------------------------------------------
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseRouting();
app.UseCors("_allowSpecificOrigins");
app.UseAuthentication();
app.UseAuthorization();

// Swagger chỉ bật khi dev
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.Run();
