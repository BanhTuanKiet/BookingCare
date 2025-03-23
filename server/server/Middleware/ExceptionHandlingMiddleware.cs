﻿using System.Net;
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
            Console.WriteLine("Error handling");
            await _next(context); // Chuyển request đến middleware tiếp theo
        }
        catch (ErrorHandlingException exception)
        {
            _logger.LogError(exception, "Custom error occurred.");
            Console.WriteLine(exception.ErrorMessage);
            await HandleExceptionAsync(context, exception);
        }
        catch (Exception otherException)
        {
            _logger.LogError(otherException, "Other exception.");
            Console.WriteLine(otherException.Message);
            await HandleOtherExceptionAsync(context, otherException);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, ErrorHandlingException exception)
    {
        Console.WriteLine("HandleExceptionAsync;");
        var response = context.Response;
        response.ContentType = "application/json";
        string defaultMessageError = "Xảy ra lỗi! Vui lòng thử lại!";

        if (exception.StatusCode == 500) {
            exception.ErrorMessage = defaultMessageError;
        }

        response.StatusCode = exception.StatusCode;

        var errorResponse = new
        {
            ErrorMessage = exception.ErrorMessage,
            //Detail = exception.StackTrace
        };

        return response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }

    private static Task HandleOtherExceptionAsync(HttpContext context, Exception exception)
    {
        Console.WriteLine("HandleOtherExceptionAsync");
        var response = context.Response;
        response.ContentType = "application/json";
        string defaultMessageError = "Xảy ra lỗi! Vui lòng thử lại!";

        response.StatusCode = 500;

        var errorResponse = new
        {
            ErrorMessage = defaultMessageError
            //Detail = exception.StackTrace
        };

        return response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }
}
