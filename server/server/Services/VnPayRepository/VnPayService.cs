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
        private readonly ClinicManagementContext _context;
        private readonly IMedicalRecord _medicalrecord;
        private readonly IAppointment _appoitment;
        private readonly ILogger<VnPayService> _logger; // Thêm logger nếu bạn muốn chuẩn .NET 8

        public VnPayService(IConfiguration configuration, ILogger<VnPayService> logger, ClinicManagementContext context, IMedicalRecord medicalrecord, IAppointment appoitment)
        {
            _configuration = configuration;
            _logger = logger;
            _context = context;
            _medicalrecord = medicalrecord;
            _appoitment = appoitment;
        }

        public async Task<string> CreatePaymentUrl(HttpContext context, int appointmentId)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = timeNow.Ticks.ToString();

            var pay = new VnPayUtil();
            var urlCallBack = _configuration["PaymentCallBack:ReturnUrl"];

            var appointment = await _context.Appointments
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);

            if (appointment == null)
                throw new Exception("Không tìm thấy lịch hẹn.");

            var record = await _context.MedicalRecords
                .FirstOrDefaultAsync(r => r.AppointmentId == appointmentId);

            float recordPrice = record?.Price ?? 0;
            float servicePrice = appointment.Service?.Price ?? 0;
            var totalAmount = recordPrice + servicePrice;

            // Bạn set sẵn ở backend
            string orderType = "other";
            string orderDescription = "Thanh toán đơn thuốc";
            string name = "Đơn thuốc của tôi";

            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((long)totalAmount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", WebUtility.UrlEncode($"{name} {orderDescription} {totalAmount}"));
            pay.AddRequestData("vnp_OrderType", orderType);
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
