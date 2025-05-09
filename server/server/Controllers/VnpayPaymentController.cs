using Microsoft.AspNetCore.Mvc;
using server.Services;
using server.DTO;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VnpayPaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public VnpayPaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        /// <summary>
        /// Create payment URL for VnPay
        /// </summary>
        [HttpPost("create/{appointmentId}")]
        public async Task<IActionResult> CreatePayment(int appointmentId)
        {
            try
            {
                var paymentUrl = await _vnPayService.CreatePaymentUrl(HttpContext, appointmentId);
                return Ok(new { paymentUrl });
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Lỗi khi tạo VNPay URL");
                return StatusCode(500, "Lỗi khi tạo VNPay URL");
            }
        }

        /// <summary>
        /// Payment callback from VnPay
        /// </summary>
        [HttpGet("callback")]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            Console.WriteLine($"Call back: {response}");
            return Ok(response);
        }
    }
}
