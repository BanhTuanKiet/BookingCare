using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
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

        private readonly ClinicManagementContext _context;

        public MomoPaymentController(IMomoService momoService, ClinicManagementContext context)
        {
            _momoService = momoService;
            _context = context;
        }

        // Update CreatePayment method to generate OrderId and Amount on the backend
        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            Console.WriteLine("Mã toa thuốc : "+request.RecordId.ToString());
            if (request == null || string.IsNullOrWhiteSpace(request.OrderInfo))
            {
                return BadRequest("Invalid request");
            }

            // Generate OrderId and Amount on the backend
            var orderId = Guid.NewGuid().ToString();
            int amount = await _momoService.CalculateAmountFromRecordId(request.RecordId);

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

        [HttpGet("check-payment-status")]
        public async Task<IActionResult> CheckPaymentStatus([FromQuery] string orderId)
        {
            if (string.IsNullOrEmpty(orderId))
            {
                return BadRequest(new { message = "Thiếu mã đơn hàng (orderId)" });
            }

            // Gọi service kiểm tra trạng thái thanh toán MoMo
            var result = await _momoService.CheckPaymentStatusAsync(orderId);

            if (result == null)
            {
                return StatusCode(500, new { message = "Không thể kiểm tra trạng thái thanh toán từ MoMo" });
            }

            // Nếu thanh toán thành công (ResultCode == 0 theo tài liệu MoMo)
            if (result.ResultCode == 0)
            {
                // Tìm lịch hẹn liên kết với MedicalRecord.RecordId == orderId
                var appointment = await _context.Appointments
                    .Include(a => a.Patient).ThenInclude(p => p.User)
                    .Include(a => a.Doctor).ThenInclude(d => d.User)
                    .Include(a => a.Service)
                    .Include(a => a.MedicalRecord) // cần Include để truy xuất RecordId
                    .FirstOrDefaultAsync(a => a.MedicalRecord != null && a.MedicalRecord.RecordId == int.Parse(orderId));

                if (appointment == null)
                {
                    return NotFound(new { message = "Không tìm thấy lịch hẹn tương ứng với đơn hàng" });
                }

                // Cập nhật trạng thái lịch hẹn
                string oldStatus = appointment.Status;
                appointment.Status = "Hoàn thành"; // hoặc bất kỳ giá trị chuẩn nào bạn đặt
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Đã thanh toán thành công",
                    paymentStatus = "Paid",
                    appointmentId = appointment.AppointmentId,
                    oldStatus = oldStatus,
                    updatedStatus = appointment.Status
                });
            }
            else
            {
                return Ok(new
                {
                    message = "Chưa thanh toán hoặc giao dịch thất bại",
                    paymentStatus = "Unpaid",
                    resultCode = result.ResultCode,
                    resultMessage = result.Message
                });
            }
        }


    }
}
// Request DTO// Update CreatePaymentRequest DTO to only include OrderInfo
public class CreatePaymentRequest
{
    public string OrderInfo { get; set; }

    public int RecordId { get; set; }
}
