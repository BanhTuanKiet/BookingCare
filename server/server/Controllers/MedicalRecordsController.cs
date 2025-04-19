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

        public MedicalRecords(ClinicManagementContext context, IMedicalRecord medicalRecordService, IAppointment appointmentService, IPatient patientService)
        {
            _context = context;
            _medicalRecordService = medicalRecordService;
            _appointmentService = appointmentService;
            _patientService = patientService;
        }

        [Authorize(Roles = "doctor")]
        [HttpPost("{appointmentId}")]
        public async Task<ActionResult> AddMedicalRecord(int appointmentId, [FromBody] MedicalRecordDTO.PrescriptionRequest prescriptionRequest )
        {
            var appointment = await _appointmentService.GetAppointmentById(appointmentId) ?? throw new ErrorHandlingException("Không tìm thấy lịch hẹn!");

            var record = await _medicalRecordService.AddMedicalRecord(appointmentId, prescriptionRequest) ?? throw new ErrorHandlingException(400, "Lỗi khi tạo toa thuốc");

            var recordDetail = await _medicalRecordService.AddMedicalRecordDetail(record.RecordId, prescriptionRequest.Medicines) ?? throw new ErrorHandlingException(400, "Lỗi khi tạo toa thuốc");

            return Ok( new { message = "Tạo toa thuốc thành công!" });
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
    }
}