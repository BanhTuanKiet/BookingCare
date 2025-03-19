using System.Net;
using System.Text.Json;
using server.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            Console.WriteLine("AAAAAAAAAAAAAAAAAAAAA");
            await _next(context); // Chuyển request đến middleware tiếp theo
        }
        catch (ErrorHandlingException exception)
        {
            _logger.LogError(exception, "An unhandled exception occurred.");
            Console.WriteLine(exception.ErrorMessage);
            await HandleExceptionAsync(context, exception);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, ErrorHandlingException exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";
        string defaultMessageError = "Xảy ra lỗi! Vui lòng thử lại!";

        if (exception.StatusCode == 500) {
            exception.ErrorMessage = defaultMessageError;
        }

        response.StatusCode = exception.StatusCode;

        var errorResponse = new
        {
            StatusCode = exception.StatusCode,
            ErrorMessage = exception.ErrorMessage,
            //Detail = exception.StackTrace
        };

        return response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }
}
