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
            Console.WriteLine(appointmentForm.Doctor);
            var doctor = await _doctorService.GetDoctorByName(appointmentForm.Doctor);
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());
            var patient = await _patientService.GetPatientById(parsedUserId);
            var service = await _serviceServices.GetServiceByName(appointmentForm.Service);

            Appointment appointment = new Appointment
            {
                PatientId = patient.PatientId,
                DoctorId = doctor.DoctorId,
                AppointmentDate = appointmentForm.AppointmentDate,
                ServiceId = service.ServiceId,
                Status = "Chờ xác nhận",
            };


            Console.WriteLine(appointment.PatientId.ToString(), appointment.DoctorId, appointment.AppointmentDate, appointment.Status);
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
            
            return Ok( new { message = "Đặt lịch thành công!"} );
        }

       // GET: Appointments
         [Authorize(Roles = "patient")]
         [HttpPost]
         public async Task<ActionResult> Appointment([FromBody] AppointmentForm appointmentForm)
         {
             Console.WriteLine(appointmentForm.Doctor);
             var doctor = await _doctorService.GetDoctorByName(appointmentForm.Doctor);
             var userId = HttpContext.Items["UserId"];
             int parsedUserId = Convert.ToInt32(userId.ToString());
             var patient = await _patientService.GetPatientById(parsedUserId);
             var service = await _serviceServices.GetServiceByName(appointmentForm.Service);
 
             Appointment appointment = new Appointment
             {
                 PatientId = patient.PatientId,
                 DoctorId = doctor.DoctorId,
                 AppointmentDate = appointmentForm.AppointmentDate,
                 ServiceId = service.ServiceId,
                 Status = "Chờ xác nhận",
             };
 
 
             Console.WriteLine(appointment.PatientId.ToString(), appointment.DoctorId, appointment.AppointmentDate, appointment.Status);
             await _context.Appointments.AddAsync(appointment);
             await _context.SaveChangesAsync();
             
             return Ok( new { message = "Đặt lịch thành công!"} );
         }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<List<AppointmentDTO.AppointmentDetail>>> GetAppointments()
        {

            var appointments = await _appointmentService.GetAppointments();

            return Ok(appointments);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("status/{id}")]
        public async Task<ActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateStatusDTO statusUpdate)
        {
            var appointment = await _appointmentService.GetAppointmentById(id) ?? throw new ErrorHandlingException("Không tìm thấy lịch hẹn");

            await _appointmentService.UpdateStatus(appointment, statusUpdate.Status);

            try
            {
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
                if (appointment.Patient?.User?.Email != null)
                {
                    Console.WriteLine($"Tìm thấy email: {appointment.Patient.User.Email}");
                    await SendStatusUpdateEmail(
                        appointment.Patient.User.Email,
                        appointment.Patient.User.FullName,
                        appointment.Doctor?.User?.FullName,
                        appointment.AppointmentDate.Value,
                        appointment.Service?.ServiceName,
                        oldStatus,
                        statusUpdate.Status
                    );
                }
                else
                {
                    Console.WriteLine("Email của bệnh nhân là null hoặc không tìm thấy");
                }

                return Ok(new { message = "Cập nhật trạng thái thành công" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi trong UpdateAppointmentStatus: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Lỗi khi cập nhật trạng thái: " + ex.Message });
            }
        }

        private async Task<bool> SendStatusUpdateEmail(string email, string patientName, string doctorName, DateTime appointmentDate, string serviceName, string oldStatus, string newStatus)
        {
            try
            {
                Console.WriteLine($"Đang cố gắng gửi email đến {email}");
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
                Console.WriteLine($"Ngày đã định dạng: {formattedDate}");
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
                Console.WriteLine("Email đã được cấu hình, đang gửi...");
                await smtpClient.SendMailAsync(message);
                Console.WriteLine("Email đã được gửi thành công");
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
            var appointment = await _context.Appointments.FindAsync(appointmentId);
                
            if (appointment == null)
            {
                throw new ErrorHandlingException("Không tìm thấy lịch hẹn");
            }

                
            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        [Authorize(Roles = "patient")]
        [HttpPost("by-patient")]
        public async Task<ActionResult> GetAppointmentByPatientId()
        {
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var patient = await _patientService.GetPatientById(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            var appointments = await _appointmentService.GetAppointmentByPatientId(patient.PatientId);

            return Ok(appointments);
        }

        // GET: Appointments
        [Authorize(Roles = "patient")]
        [HttpPut("cancel/{appointmentId}")]
        public async Task<ActionResult> CancelAppointment( int appointmentId)
        {
            var appointment = await _appointmentService.GetAppointmentById(appointmentId) ?? throw new ErrorHandlingException("Không tìm thấy lịch hẹn" );
    
            _appointmentService.CancelAppointment(appointment);

            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        [Authorize(Roles = "doctor")]
        [HttpGet("schedule")]
        public async Task<ActionResult<List<AppointmentDTO.DoctorScheduleDTO>>> GetDoctorSchedule()
        {
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var doctor = await _doctorService.GetDoctorById(parsedUserId) ?? throw new ErrorHandlingException(404, "Không tìm thấy bác sĩ!");

            var schedule = await _appointmentService.GetDoctorSchedule(doctor.DoctorId) ?? throw new ErrorHandlingException(404, "Không tìm thấy lịch làm việc!");

            return schedule;
        }

    }
}