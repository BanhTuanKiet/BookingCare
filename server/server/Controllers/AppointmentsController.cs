using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
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
        private readonly IDoctor _doctor;
        private readonly IPatient _patientService;
        private readonly IAppointment _appointmentService;

        public AppointmentsController(IDoctor doctor, IPatient patientService, IAppointment appointmentService)
        {
            _doctor = doctor;
            _patientService = patientService;
            _appointmentService = appointmentService;
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

            var doctor = await _doctor.GetDoctorById(parsedUserId) ?? throw new ErrorHandlingException(404, "Không tìm thấy bác sĩ!");

            var schedule = await _appointmentService.GetDoctorSchedule(doctor.DoctorId) ?? throw new ErrorHandlingException(404, "Không tìm thấy lịch làm việc!");

            return schedule;
        }
    }
}