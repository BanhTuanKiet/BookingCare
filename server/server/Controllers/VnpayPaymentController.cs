using Microsoft.AspNetCore.Mvc;
using System.Web;
using System.Text;
using System.Security.Cryptography;

namespace YourProjectName.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VnpayPaymentController : ControllerBase
    {
        [HttpPost("create-payment")]
        public IActionResult CreatePayment([FromBody] PaymentRequest request)
        {
            var vnp_TmnCode = "CIL4LZKF"; // <-- thay vào
            var vnp_HashSecret = "5MSPQ8EFHKUFFI4SEE3LVMYKFL5WMCUG"; // <-- thay vào
            var vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            var vnp_Returnurl = "https://yourfrontend.com/payment-success"; // trang trả về sau thanh toán

            var amount = (request.Amount * 100).ToString(); // VNPay yêu cầu nhân 100
            var vnp_TxnRef = DateTime.Now.Ticks.ToString(); // mã đơn hàng
            var vnp_OrderInfo = "Thanh toán lịch khám BookingCare";
            var vnp_IpAddr = HttpContext.Connection.RemoteIpAddress?.ToString();

            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", amount);
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_TxnRef", vnp_TxnRef);
            vnpay.AddRequestData("vnp_OrderInfo", vnp_OrderInfo);
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
            vnpay.AddRequestData("vnp_IpAddr", vnp_IpAddr);
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));

            var paymentUrl = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);
            return Ok(new { payUrl = paymentUrl });
        }
    }

    public class PaymentRequest
    {
        public int Amount { get; set; }
    }

    public class VnPayLibrary
    {
        private SortedList<string, string> requestData = new SortedList<string, string>();

        public void AddRequestData(string key, string value)
        {
            requestData.Add(key, value);
        }

        public string CreateRequestUrl(string baseUrl, string secretKey)
        {
            var data = requestData.Select(x => $"{x.Key}={HttpUtility.UrlEncode(x.Value)}");
            var signData = string.Join("&", data);
            var sign = HmacSHA512(secretKey, signData);
            var url = $"{baseUrl}?{signData}&vnp_SecureHash={sign}";
            return url;
        }

        private string HmacSHA512(string key, string inputData)
        {
            var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key));
            var hashValue = hmac.ComputeHash(Encoding.UTF8.GetBytes(inputData));
            return BitConverter.ToString(hashValue).Replace("-", "").ToLower();
        }
    }
}
