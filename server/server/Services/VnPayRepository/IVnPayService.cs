using server.DTO;
using Microsoft.AspNetCore.Http;

namespace server.Services
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentDTO.PaymentInformationModel model, HttpContext context);
        PaymentDTO.PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}