using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Services;
using Server.DTO;

namespace server.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class AppointmentsController : Controller
    {
        private readonly ClinicManagementContext _context;
        private readonly IDoctor _doctorService;
        private readonly IPatient _patientService;
        private readonly IAppointment _appointmentService;
        private readonly IService _serviceServices;
        private readonly IConfiguration _configuration;

        public AppointmentsController(ClinicManagementContext context, IDoctor doctorService, IPatient patientService, IAppointment appointmentService, IService serviceServices, IConfiguration configuration)
        {
            _context = context;
            _doctorService = doctorService;
            _patientService = patientService;
            _appointmentService = appointmentService;
            _serviceServices = serviceServices;
            _configuration = configuration;
        }
        // GET: Appointments
        [Authorize(Roles = "patient")]
        [HttpPost]
        public async Task<ActionResult> Appointment([FromBody] AppointmentForm appointmentForm)
        {
            var doctor = await _doctorService.GetDoctorByName(appointmentForm.Doctor);
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());
            var patient = await _patientService.GetPatientByUserId(parsedUserId);
            var service = await _serviceServices.GetServiceByName(appointmentForm.Service);
            
            var isExistAppointment = await _appointmentService.IsExistAppointment(patient.PatientId, appointmentForm.AppointmentDate, appointmentForm.AppointmentTime);

            if (isExistAppointment != null) 
            {
                throw new ErrorHandlingException(400, $"Lịch hẹn {appointmentForm.AppointmentDate} {appointmentForm.AppointmentTime} đang chờ xác nhận");
            }

            var appointment = await _appointmentService.Appointment(patient.PatientId, doctor.DoctorId, service.ServiceId, appointmentForm.AppointmentDate, appointmentForm.AppointmentTime, "Chờ xác nhận");
            
            return Ok( new { message = "Đặt lịch thành công!"} );
        }

        [Authorize(Roles = "admin")]
        [HttpGet()]
        public async Task<ActionResult<List<AppointmentDTO.AppointmentDetail>>> GetAppointments()
        {
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var appointments = await _appointmentService.GetAppointments();

            return Ok(appointments);
        }

        [Authorize(Roles = "admin, doctor")]
        [HttpPut("status/{id}")]
        public async Task<ActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateStatusDTO statusUpdate)
        {
            var role = HttpContext.Items["role"].ToString();
                
            if (role == "doctor" && statusUpdate.Status != "Đã khám")
            {
                throw new ErrorHandlingException(403, "Bạn không có quyền!");
            }
                // Sử dụng Include() để load các thực thể liên quan
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);
                
            if (appointment == null)
            {
                return NotFound(new { message = "Không tìm thấy lịch hẹn" });
            }
                
            string oldStatus = appointment.Status;
            appointment.Status = statusUpdate.Status;
            await _context.SaveChangesAsync();
                
                // Kiểm tra nếu patient và email tồn tại trước khi gửi email
            if (appointment.Patient?.User?.Email == null)
            {
                throw new ErrorHandlingException(404, "Không tìm thấy email bệnh nhân!");
            }
            
            await SendStatusUpdateEmail(
                appointment.Patient.User.Email,
                appointment.Patient.User.FullName,
                appointment.Doctor?.User?.FullName,
                appointment.AppointmentDate.Value,
                appointment.Service?.ServiceName,
                oldStatus,
                statusUpdate.Status
            );
            
            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        private async Task<bool> SendStatusUpdateEmail(string email, string patientName, string doctorName, DateTime appointmentDate, string serviceName, string oldStatus, string newStatus)
        {
            try
            {
                var smtpClient = new SmtpClient
                {
                    Host = _configuration["EmailSettings:SmtpServer"],
                    Port = int.Parse(_configuration["EmailSettings:Port"]),
                    EnableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]),
                    Credentials = new System.Net.NetworkCredential(
                        _configuration["EmailSettings:SenderEmail"],
                        _configuration["EmailSettings:Password"]
                    )
                };

                string formattedDate = appointmentDate.ToString("dd/MM/yyyy HH:mm");

                var message = new MailMessage
                {
                    From = new MailAddress(_configuration["EmailSettings:SenderEmail"], _configuration["EmailSettings:SenderName"]),
                    Subject = "Thông báo cập nhật trạng thái lịch hẹn",
                    Body = $@"
                        <html>
                        <body>
                            <h2>Cập nhật trạng thái lịch hẹn</h2>
                            <p>Xin chào {patientName},</p>
                            <p>Lịch hẹn khám bệnh của bạn đã được cập nhật trạng thái.</p>
                            <p><strong>Thông tin lịch hẹn:</strong></p>
                            <ul>
                                <li>Bác sĩ: {doctorName}</li>
                                <li>Dịch vụ: {serviceName}</li>
                                <li>Ngày hẹn: {formattedDate}</li>
                                <li>Trạng thái cũ: {oldStatus}</li>
                                <li>Trạng thái mới: <strong>{newStatus}</strong></li>
                            </ul>
                            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
                            <p>Trân trọng,<br/>Hệ thống đặt lịch khám bệnh</p>
                        </body>
                        </html>",
                    IsBodyHtml = true
                };

                message.To.Add(email);

                await smtpClient.SendMailAsync(message);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi gửi email: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return false;
            }
        }

        [Authorize(Roles = "patient")]
        [HttpPut("cancel/{appointmentId}")]
        public async Task<ActionResult> CancelAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId) ?? throw new ErrorHandlingException("Không tìm thấy lịch hẹn");
                
            appointment.Status = "Đã hủy";
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        [Authorize(Roles = "patient")]
        [HttpPost("by-patient/{quantity}")]
        public async Task<ActionResult> GetAppointmentByPatientId(int quantity)
        {
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            Console.WriteLine("UserId: " + parsedUserId);

            var patient = await _patientService.GetPatientByUserId(parsedUserId) ?? throw new ErrorHandlingException("Không tim thấy bệnh nhân");

            var appointments = await _appointmentService.GetAppointmentByPatientId(patient.PatientId, quantity);
            return Ok(appointments);
        }

        [Authorize(Roles = "doctor")]
        [HttpGet("schedule")]
        public async Task<ActionResult<List<AppointmentDTO.DoctorScheduleDTO>>> GetDoctorSchedule()
        {
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var doctor = await _doctorService.GetDoctorById(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bác sĩ!");

            var schedule = await _appointmentService.GetDoctorSchedule(doctor.DoctorId) ?? throw new ErrorHandlingException("Không tìm thấy lịch làm việc!");
            
            return schedule;
        }

        [Authorize(Roles = "doctor")]
        [HttpGet("schedule_detail")]
        public async Task<ActionResult> GetDoctorScheduleByDateTime([FromQuery] string date, [FromQuery] string time)
        {
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var doctor = await _doctorService.GetDoctorById(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bác sĩ!");

            var schedules = await _appointmentService.GetDoctorScheduleDetail(doctor.DoctorId, date, time);

            return Ok(new { schedules = schedules, doctor = doctor });
        }

        [Authorize(Roles = "doctor")]
        [HttpGet("examined_patients")]
        public async Task<ActionResult> GetPatientByStatus()
        {
            var userId = HttpContext.Items["UserId"].ToString();
            int parsedUserId = Convert.ToInt32(userId);

            var doctor = await _doctorService.GetDoctorById(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bác sĩ!");

            var schedules = await _appointmentService.GetPatientScheduleDetail(doctor.DoctorId);

            return Ok(new { schedules = schedules});
        }

        [Authorize(Roles = "patient")]
        [HttpGet("recently")]
        public async Task<ActionResult> GetRecentAppointment()
        {
            var userId = HttpContext.Items["UserId"].ToString();
            int parsedUserId = Convert.ToInt32(userId);
            
            var patient = await _patientService.GetPatientByUserId(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            var appointment = await _appointmentService.GetRecentAppointment(patient.PatientId);

            return Ok(appointment);
        }

        [HttpGet("examined/{doctorId}")]
        public async Task<ActionResult> GetExaminedPatientCount(int doctorId)
        {
            var examinedPatientCount = await _appointmentService.GetExaminedPatientCount(doctorId);

            return Ok(examinedPatientCount);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("statistics/{month}")]
        public async Task<ActionResult> AppointmentStatistics(int month)
        {
            var appointment = await _appointmentService.AppointmentStatistics(month);

            return Ok(appointment);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("statistics/{month}/week")]
        public async Task<ActionResult> AppointmentStatisticsPerWeek(int month)
        {
            var appointment = await _appointmentService.AppointmentStatisticsPerWeek(month);

            return Ok(appointment);
        }
    }
}