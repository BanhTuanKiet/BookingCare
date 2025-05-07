using server.DTO;
using Microsoft.AspNetCore.Http;

namespace server.Services
{
    public interface IVnPayService
    {
        Task<string> CreatePaymentUrl(HttpContext context, int appointmentId);
        PaymentDTO.PaymentResponseModel PaymentExecute(IQueryCollection collections);
    }
}