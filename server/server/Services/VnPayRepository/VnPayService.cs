using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using server.DTO;
using server.Models;
using server.Util;
using System.Net; // <--- thay cho System.Web
using Microsoft.AspNetCore.Http;

namespace server.Services
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<VnPayService> _logger; // Thêm logger nếu bạn muốn chuẩn .NET 8

        public VnPayService(IConfiguration configuration, ILogger<VnPayService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public string CreatePaymentUrl(PaymentDTO.PaymentInformationModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = timeNow.Ticks.ToString(); // sửa từ DateTime.Now thành timeNow cho đồng bộ
            var pay = new VnPayUtil();
            var urlCallBack = _configuration["PaymentCallBack:ReturnUrl"];

            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((long)model.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);

            // Dùng WebUtility.UrlEncode
            pay.AddRequestData("vnp_OrderInfo", WebUtility.UrlEncode($"{model.Name} {model.OrderDescription} {model.Amount}"));
            //pay.AddRequestData("vnp_OrderInfo", $"{model.Name} {model.OrderDescription} {model.Amount}");
            pay.AddRequestData("vnp_OrderType", model.OrderType);
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", tick);

            var paymentUrl = pay.CreateRequestUrl(
                _configuration["Vnpay:BaseUrl"], 
                _configuration["Vnpay:HashSecret"]
            );

            _logger.LogInformation("Generated Payment URL: {PaymentUrl}", paymentUrl);

            return paymentUrl;
        }

        public PaymentDTO.PaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var pay = new VnPayUtil();
            var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);

            _logger.LogInformation("Response from VNPAY: {@Response}", response);

            return response;
        }
    }
}
