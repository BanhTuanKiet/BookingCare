using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using server.DTO;
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

        public AppointmentsController(ClinicManagementContext context, IDoctor doctorService, IPatient patientService, IAppointment appointmentService)
        {
            _context = context;
            _doctorService = doctorService;
            _patientService = patientService;
            _appointmentService = appointmentService;
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

            Appointment appointment = new Appointment
            {
                PatientId = patient.PatientId,
                DoctorId = doctor.DoctorId,
                AppointmentDate = appointmentForm.AppointmentDate,
                ServiceId = 1,
                Status = "Chờ xác nhận",
            };


            Console.WriteLine(appointment.PatientId.ToString(), appointment.DoctorId, appointment.AppointmentDate, appointment.Status);
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
            
            return Ok( new { message = "Đặt lịch thành công!"} );
        }

        [Authorize(Roles = "admin")]
        [HttpGet()]
        public async Task<ActionResult<List<AppointmentDTO.AppointmentDetail>>> GetAppointments()
        {
            Console.WriteLine("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var appointments = await _appointmentService.GetAppointments();

            return Ok(appointments);
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateStatusDTO statusUpdate)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                
                if (appointment == null)
                {
                    return NotFound(new { message = "Không tìm thấy lịch hẹn" });
                }
                
                appointment.Status = statusUpdate.Status;
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Cập nhật trạng thái thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật trạng thái: " + ex.Message });
            }
        }
    }
}
