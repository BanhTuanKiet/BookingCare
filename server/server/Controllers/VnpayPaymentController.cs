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
        [HttpPost("create")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentDTO.PaymentInformationModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid payment request.");
            }

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { paymentUrl = url });
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
