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
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.OpenApi.Expressions;

namespace Clinic_Management.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecords : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly IMedicalRecord _medicalRecordService;
        private readonly IAppointment _appointmentService;
        private readonly IPatient _patientService;
        private readonly IDoctor _doctorService;
        private readonly IEmailService _emailService;

        public MedicalRecords(ClinicManagementContext context, IMedicalRecord medicalRecordService, IAppointment appointmentService, IPatient patientService, IDoctor doctorService, IEmailService emailService)
        {
            _context = context;
            _medicalRecordService = medicalRecordService;
            _appointmentService = appointmentService;
            _patientService = patientService;
            _doctorService = doctorService;
            _emailService = emailService;
        }

        [Authorize(Roles = "doctor")]
        [HttpPost("{appointmentId}")]
        public async Task<ActionResult> AddMedicalRecord(int appointmentId, [FromBody] MedicalRecordDTO.PrescriptionRequest prescriptionRequest )
        {
            var appointment = await _appointmentService.GetAppointmentById(appointmentId) ?? throw new ErrorHandlingException("Không tìm thấy lịch hẹn!");

            var record = await _medicalRecordService.AddMedicalRecord(appointmentId, prescriptionRequest) ?? throw new ErrorHandlingException(400, "Lỗi khi tạo toa thuốc");

            var recordDetail = await _medicalRecordService.AddMedicalRecordDetail(record.RecordId, prescriptionRequest.Medicines) ?? throw new ErrorHandlingException(400, "Lỗi khi tạo toa thuốc");
            var patient = await _patientService.GetPatientById(appointment.PatientId.Value) ?? throw new ErrorHandlingException(400, "Không tìm thấy bệnh nhân!");
             Console.WriteLine("Tên BỆNh nhân: ", patient.UserName);
            try
            {
                 await SendEmailForPatient(patient.Email, appointment, prescriptionRequest, prescriptionRequest.Medicines);
            }
            catch (Exception ex)
            {
                throw new ErrorHandlingException(500, $"Không thể gửi email: {ex.Message}");
            }
 
            return Ok(new { message = "Tạo toa thuốc thành công!" });
        }

        private async Task SendEmailForPatient(string Email, Appointment appointment, MedicalRecordDTO.PrescriptionRequest prescriptionRequest, List<MedicalRecordDTO.MedicineDto> medicalRecordDetails)
         {
             Console.WriteLine($"Id Bác sĩ {appointment.DoctorId}, Id bệnh nhân: {appointment.PatientId}");
            //  var patient = await _patientService.GetPatientById(appointment.PatientId.Value) ?? throw new ErrorHandlingException(400, "Không tìm thấy bệnh nhân!");
            //  Console.WriteLine("Tên BỆNh nhân: ", patient.UserName);
             var doctor = await _doctorService.GetDoctorById(appointment.DoctorId.Value) ?? throw new ErrorHandlingException(400, "Không tìm thấy bác sĩ!");
 
             if (medicalRecordDetails == null || !medicalRecordDetails.Any())
             {
                 throw new ErrorHandlingException("Không tìm thấy chi tiết toa thuốc!");
             }
 
             string subject = "Toa thuốc của bạn từ phòng khám";
 
             string body = $@"
                 <p>Bạn đã được bác sĩ <b>{doctor.UserName}</b> kê toa thuốc trong buổi khám ngày <b>{appointment.AppointmentDate:dd/MM/yyyy}</b>.</p>
                 <p>Chẩn đoán bệnh: <b>{prescriptionRequest.Diagnosis}</b></p>
                 <p>Hướng điều trị: <b>{prescriptionRequest.Treatment}</b></p>
                 <h3>Chi tiết toa thuốc:</h3>
                 <table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;'>
                     <tr>
                         <th>Tên thuốc</th>
                         <th>Liều dùng</th>
                         <th>Số lần/ngày</th>
                         <th>Số ngày</th>
                         <th>Cách dùng</th>
                         <th>Số lượng</th>
                         <th>Đơn vị thuốc</th>
                     </tr>";
 
             foreach (var item in medicalRecordDetails)
             {
                 body += $@"
                     <tr style='text-align: center;'>
                         <td>{item.MedicineName}</td>
                         <td>{item.Dosage}</td>
                         <td>{item.FrequencyPerDay}</td>
                         <td>{item.DurationInDays}</td>
                         <td>{item.Usage}</td>
                         <td>X {item.Quantity}</td>
                         <td>{item.Unit}</td>
                     </tr>";
             }
 
             body += $@"</table>
                 <p>Lời dặn của bác sĩ: <b>{prescriptionRequest.Notes}</b></p>
                 <br><p><i>Lưu ý: Vui lòng sử dụng thuốc đúng theo hướng dẫn và quay lại tái khám nếu cần.</i></p>
                 <p>Chúc bạn mau hồi phục sức khỏe!</p>";
 
             await _emailService.SendEmailAsync(Email, subject, body);
        }

        [Authorize(Roles = "patient")]
        [HttpGet("prescriptions")]
        public async Task<ActionResult> GetPrescriptions()
        {
            var userId = HttpContext.Items["UserId"].ToString();
            var parsedUserId = Convert.ToInt32(userId);

            var patient = await _patientService.GetPatientById(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            var appointments = await _appointmentService.GetAppointmentsId(patient.PatientId);

            var medicalRecords = await _medicalRecordService.GetMedicalRecords(appointments) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");;
        
            return Ok(medicalRecords);
        }

        [Authorize(Roles = "patient")]
        [HttpGet("prescriptions/recently")]
        public async Task<ActionResult> GetRecentPrescriptions()
        {
            var userId = HttpContext.Items["UserId"].ToString();
            var parsedUserId = Convert.ToInt32(userId);

            var patient = await _patientService.GetPatientById(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            var appointments = await _appointmentService.GetAppointmentsId(patient.PatientId);

            var medicalRecords = await _medicalRecordService.GetRecentMedicalRecords(appointments) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");;

            return Ok(medicalRecords);
        }

        [Authorize(Roles = "patient")]
        [HttpGet("detail/{recordId}")]
        public async Task<ActionResult> GetMedicalRecordDetail(int recordId)
        {
            // var userId = HttpContext.Items["UserId"].ToString();
            // var parsedUserId = Convert.ToInt32(userId);

            // var patient = await _patientService.GetPatientById(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            var recordDetail = await _medicalRecordService.GetRecordDetail(recordId) ?? throw new ErrorHandlingException("Không tìm thấy chi tiết toa thuốc!");

            return Ok(recordDetail);
        }


    }
}