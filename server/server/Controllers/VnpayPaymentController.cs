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


//     public class PaymentRequest
//     {
//         public string OrderId { get; set; }
//         public string OrderInfo { get; set; }
//         public int Amount { get; set; }
//     }

//     public class VnPayLibrary
//     {
//         // private SortedList<string, string> requestData = new SortedList<string, string>();
//         private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
//         private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());


//         public void AddRequestData(string key, string value)
//         {
//             if (!string.IsNullOrEmpty(value))
//             {
//                 _requestData.Add(key, value);
//             }
//         }

// public string CreateRequestUrl(string baseUrl, string secretKey)
// {
//     // B1: Tạo signData
//     var signData = string.Join("&", requestData.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));
//     var sign = HmacSHA512(secretKey, signData);

//     Console.WriteLine("Raw sign data: " + signData);
//     Console.WriteLine("Generated hash: " + sign);

//     // B2: Encode cả key lẫn value
//     var data = requestData.Select(x => $"{HttpUtility.UrlEncode(x.Key)}={HttpUtility.UrlEncode(x.Value)}");
//     var queryString = string.Join("&", data);

//     // B3: Build full URL
//     var fullUrl = $"{baseUrl}?{queryString}&vnp_SecureHash={sign}";
//     Console.WriteLine("Final URL: " + fullUrl);
    
//     return fullUrl;
// }



// private string HmacSHA512(string key, string inputData)
// {
//     var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
//     var hashValue = hmac.ComputeHash(Encoding.UTF8.GetBytes(inputData));
    
//     var sb = new StringBuilder();
//     foreach (var b in hashValue)
//     {
//         sb.Append(b.ToString("x2")); // x2 sẽ tạo ra hex lowercase
//     }
    
//     return sb.ToString();
// }
    //}
// }
