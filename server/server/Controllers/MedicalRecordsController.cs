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
        private readonly IMedicine _medicineService;
        private readonly IConfiguration _configuration;

        public MedicalRecords(ClinicManagementContext context, IMedicalRecord medicalRecordService, IAppointment appointmentService, IPatient patientService, IDoctor doctorService, IMedicine medicineService, IConfiguration configuration)
        {
            _context = context;
            _medicalRecordService = medicalRecordService;
            _appointmentService = appointmentService;
            _patientService = patientService;
            _doctorService = doctorService;
            _medicineService = medicineService;
            _configuration = configuration;
        }

        [Authorize(Roles = "doctor")]
        [HttpPost("{appointmentId}")]
        public async Task<ActionResult> AddMedicalRecord(int appointmentId, [FromBody] MedicalRecordDTO.PrescriptionRequest prescriptionRequest )
        {
            var appointment = await _appointmentService.GetAppointmentById(appointmentId) ?? throw new ErrorHandlingException("Không tìm thấy lịch hẹn!");

            var record = await _medicalRecordService.AddMedicalRecord(appointmentId, prescriptionRequest) ?? throw new ErrorHandlingException(400, "Lỗi khi tạo toa thuốc");

            var recordDetail = await _medicalRecordService.AddMedicalRecordDetail(record.RecordId, prescriptionRequest.Medicines) ?? throw new ErrorHandlingException(400, "Lỗi khi tạo toa thuốc");
            await _appointmentService.UpdateStatus(appointment, "Đã khám");
            var patient = await _patientService.GetPatientById(appointment.PatientId.Value) ?? throw new ErrorHandlingException(400, "Không tìm thấy bệnh nhân!");
            
            await _appointmentService.UpdateStatus(appointment, "Đã khám");
            
            try
            {
                 await SendEmailForPatient(patient.Email, appointment, prescriptionRequest, record.RecordId);
            }
            catch (Exception ex)
            {
                throw new ErrorHandlingException(500, $"Không thể gửi email: {ex.Message}");
            }
 
            return Ok(new { message = "Tạo toa thuốc thành công!" });
        }

        private async Task SendEmailForPatient(string Email, Appointment appointment, MedicalRecordDTO.PrescriptionRequest prescriptionRequest, int recordId)
         {
             Console.WriteLine($"Id Bác sĩ {appointment.DoctorId}, Id bệnh nhân: {appointment.PatientId}");
            //  var patient = await _patientService.GetPatientById(appointment.PatientId.Value) ?? throw new ErrorHandlingException(400, "Không tìm thấy bệnh nhân!");
            //  Console.WriteLine("Tên BỆNh nhân: ", patient.UserName);
             var doctor = await _doctorService.GetDoctorById(appointment.DoctorId.Value) ?? throw new ErrorHandlingException(400, "Không tìm thấy bác sĩ!");
 
            var recordDetail = await _medicalRecordService.GetRecordDetail(recordId);

             if (recordDetail == null || !recordDetail.Any())
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
                       <th>Liều lượng</th>
                       <th>Tần suất</th>
                       <th>Thời gian</th>
                    </tr>";

             foreach (var item in recordDetail)
             {
                 body += $@"
                     <tr style='text-align: center;'>
                         <td>{item.MedicineName}</td>
                         <td>{item.Dosage} Lần / Ngày </td>
                         <td>{item.FrequencyPerDay} Lần  / {item.Unit}</td>
                         <td>{item.DurationInDays} Ngày</td>
                         <td>{item.Usage}</td>
                         <td>{item.Price}</td>
                         <td>{item.Quantity}</td>
                     </tr>";
             }
 
             body += $@"</table>
                 <p>Lời dặn của bác sĩ: <b>{prescriptionRequest.Notes}</b></p>
                 <br><p><i>Lưu ý: Vui lòng sử dụng thuốc đúng theo hướng dẫn và quay lại tái khám nếu cần.</i></p>
                 <p>Chúc bạn mau hồi phục sức khỏe!</p>";
            
 
             await EmailUtil.SendEmailAsync(Email, subject, body, _configuration);
        }

        [Authorize(Roles = "patient")]
        [HttpGet("prescriptions")]
        public async Task<ActionResult> GetPrescriptions()
        {
            var userId = HttpContext.Items["UserId"].ToString();
            var parsedUserId = Convert.ToInt32(userId);

            var patient = await _patientService.GetPatientByUserId(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            var appointments = await _appointmentService.GetAppointmentsId(patient.PatientId);

            var medicalRecords = await _medicalRecordService.GetMedicalRecords(appointments) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");;
        
            return Ok(medicalRecords);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("prescriptions/patient")]
        public async Task<ActionResult> GetPrescriptionsByPatient()
        {
            // Lấy danh sách appointments và group theo PatientId để loại trùng
            var distinctAppointments = await _context.MedicalRecords
                .Join(_context.Appointments,
                    mr => mr.AppointmentId,
                    ap => ap.AppointmentId,
                    (mr, ap) => ap)
                .GroupBy(a => a.PatientId)
                .Select(g => new
                {
                    PatientId = g.Key,
                    AppointmentId = g.OrderBy(a => a.AppointmentDate).Select(a => a.AppointmentId).FirstOrDefault()
                })
                .ToListAsync();

            // Lấy danh sách AppointmentId duy nhất
            var appointmentIds = distinctAppointments.Select(a => a.AppointmentId).ToList();

            // Gọi MedicalRecordService để lấy tất cả đơn thuốc theo danh sách AppointmentId
            var medicalRecords = await _medicalRecordService.GetMedicalRecords(appointmentIds)
                                ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            return Ok(medicalRecords);
        }


        [Authorize(Roles = "admin")]
        [HttpGet("prescriptions/patient/{patientId}")]
        public async Task<ActionResult<List<MedicalRecordDTO.MedicalRecordBasic>>> GetAllMedicalRecordByPatientId(int patientId)
        {
            // Lấy tất cả appointmentId có PatientId == patientId
            var appointmentIds = await _context.Appointments
                .Include(mr => mr.Patient)
                .Where(a => a.PatientId == patientId)
                .Select(a => a.AppointmentId)
                .ToListAsync();

            // Truy vấn đơn thuốc dựa trên danh sách appointmentId
            var medicalRecords = await _medicalRecordService.GetMedicalRecords(appointmentIds) 
                                ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            return Ok(medicalRecords);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("details/{recordId}")]
        public async Task<ActionResult> GetMedicalRecordDetailByRecordId(int recordId) {
            var recordDetail = await _medicalRecordService.GetRecordDetail(recordId) ?? throw new ErrorHandlingException("Không tìm thấy chi tiết toa thuốc!");
            var recorRecentDetail = await _medicalRecordService.GetMedicalRecordsByRecoredId(recordId) ?? throw new ErrorHandlingException("Không tìm thấy chi tiết toa thuốc!");
            
            string body = $@"
                 <p>Bạn đã được bác sĩ <b>{recorRecentDetail.DoctorName}</b> kê toa thuốc trong buổi khám ngày <b>{recorRecentDetail.AppointmentDate:dd/MM/yyyy}</b>.</p>
                 <p>Chẩn đoán bệnh: <b>{recorRecentDetail.Diagnosis}</b></p>
                 <p>Hướng điều trị: <b>{recorRecentDetail.Treatment}</b></p>
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
 
             foreach (var item in recordDetail)
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
                 <p>Lời dặn của bác sĩ: <b>{recorRecentDetail.Notes}</b></p>";
            return Content(body, "text/html");
        }

        [Authorize(Roles = "patient")]
        [HttpGet("prescriptions/recently")]
        public async Task<ActionResult> GetRecentPrescriptions()
        {
            var userId = HttpContext.Items["UserId"].ToString();
            var parsedUserId = Convert.ToInt32(userId);

            var patient = await _patientService.GetPatientByUserId(parsedUserId) ?? throw new ErrorHandlingException(400, "Không tìm thấy bệnh nhân!");
            
            var appointments = await _appointmentService.GetAppointmentsId(patient.PatientId) ?? throw new ErrorHandlingException(400, "Không tìm thấy lịch hẹn!");

            var medicalRecords = await _medicalRecordService.GetRecentMedicalRecords(appointments);

            if (medicalRecords == null || medicalRecords.Count == 0)
            {
                throw new ErrorHandlingException(400, "Không tìm thấy hồ sơ bệnh án!");
            }

            return Ok(medicalRecords);
        }

        [Authorize(Roles = "patient, admin")]
        [HttpGet("detail/{recordId}")]
        public async Task<ActionResult> GetMedicalRecordDetail(int recordId)
        {
            // var userId = HttpContext.Items["UserId"].ToString();
            // var parsedUserId = Convert.ToInt32(userId);

            // var patient = await _patientService.GetPatientByUserId(parsedUserId) ?? throw new ErrorHandlingException("Không tìm thấy bệnh nhân!");

            var recordDetail = await _medicalRecordService.GetRecordDetail(recordId) ?? throw new ErrorHandlingException("Không tìm thấy chi tiết toa thuốc!");

            return Ok(recordDetail);
        }


    }
}