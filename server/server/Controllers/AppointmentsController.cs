using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Models;

namespace server.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class AppointmentsController : Controller
    {
        private readonly ClinicManagementContext _context;

        public AppointmentsController(ClinicManagementContext context)
        {
            _context = context;
        }

    // GET: Appointments
    [HttpPost]
    public async Task<ActionResult> Appointment([FromBody] object appointmentForm)
    {
        if (appointmentForm == null)
        {
            return BadRequest("Invalid appointment data.");
        }
        return Ok( new { message = "Đặt lịch thành công!" } );
    }

    }
}
