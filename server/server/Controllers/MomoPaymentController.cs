using Microsoft.AspNetCore.Mvc;
using server.Services;
using System.Text.Json;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class MomoPaymentController : ControllerBase
    {
        private readonly IMomoService _momoService;

        public MomoPaymentController(IMomoService momoService)
        {
            _momoService = momoService;
        }

        // Update CreatePayment method to generate OrderId and Amount on the backend
        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.OrderInfo))
            {
                return BadRequest("Invalid request");
            }

            // Generate OrderId and Amount on the backend
            var orderId = Guid.NewGuid().ToString();
            var amount = 1000; // Example: Set a fixed amount or calculate dynamically

            Console.WriteLine($"Generated OrderId: {orderId}");
            Console.WriteLine($"OrderInfo: {request.OrderInfo}");
            Console.WriteLine($"Generated Amount: {amount}");

            var result = await _momoService.CreatePaymentAsync(orderId, request.OrderInfo, amount);
            Console.WriteLine($"MoMo payment response: {JsonSerializer.Serialize(result)}");
            return Ok(result);
        }


        [HttpGet("payment-execute")]
        public IActionResult PaymentExecute()
        {
            var data = _momoService.PaymentExecuteAsync(Request.Query);
            return Ok(data);
        }
        // [HttpGet("payment-status")]
        // public async Task<IActionResult> CheckPaymentStatus(string orderId)
        // {
        //     var result = await _momoService.CheckPaymentStatusAsync(orderId);
        //     if (result.IsSuccess)
        //     {
        //         return Ok(new { status = "success" });
        //     }
        //     else
        //     {
        //         return Ok(new { status = "failure" });
        //     }
        // }

    }
}
// Request DTO// Update CreatePaymentRequest DTO to only include OrderInfo
public class CreatePaymentRequest
{
    public string OrderInfo { get; set; }
}
