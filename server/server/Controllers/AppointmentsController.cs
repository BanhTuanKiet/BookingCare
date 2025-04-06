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
    [Authorize]
    [Route("api/[Controller]")]
    [ApiController]
    public class AppointmentsController : Controller
    {
        private readonly ClinicManagementContext _context;
        private readonly IDoctor _doctorService;
        private readonly IPatient _patientService;
        // private readonly IAppointment _appointmentService;

        public AppointmentsController(ClinicManagementContext context, IDoctor doctorService, IPatient patientService)
        {
            _context = context;
            _doctorService = doctorService;
            _patientService = patientService;
            // _appointmentService = appointmentService;
        }
        // GET: Appointments
        [HttpPost]
        public async Task<ActionResult> Appointment([FromBody] AppointmentForm appointmentForm)
        {
            var doctor = await _doctorService.GetDoctorByName(appointmentForm.Doctor);
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());
            var patient = await _patientService.GetPatientById(parsedUserId);

            Appointment appointment = new Appointment
            {
                PatientId = patient.PatientId,
                DoctorId = doctor.DoctorId,
                AppointmentDate = appointmentForm.AppointmentDate,
                Status = "Chờ xác nhận",
            };
            return Ok( new { message = "Đặt lịch thành công!", appointment = appointment } );
        }

    }
}
