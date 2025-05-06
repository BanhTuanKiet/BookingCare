using server.DTO;
using server.Models;

namespace server.Services
{
    
    public interface IMomoService
{
    Task<MomoCreatePaymentResponseModel> CreatePaymentAsync(string orderId, string orderInfo, int amount);
    MomoExecuteResponseModel PaymentExecuteAsync(IQueryCollection collection);
    Task<int> CalculateAmountFromRecordId(int recordId);
    
}

}