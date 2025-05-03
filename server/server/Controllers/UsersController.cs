using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly IUser _userService;

        public UsersController(ClinicManagementContext context, IUser userService)
        {
            _context = context;
            _userService = userService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet()]
        public async Task<ActionResult<List<AppointmentDTO.AppointmentDetail>>> GetUsers()
        {
            var userId = HttpContext.Items["UserId"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var users = await _userService.GetUsers();

            return Ok(users);
        }

        [HttpGet("profile")]
        public async Task<ActionResult> GetUserById()
        {
            var userId = HttpContext.Items["UserId"];
            var role = HttpContext.Items["role"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var user = await _userService.GetUserById(parsedUserId, role.ToString());

            return Ok(user);
        }

        [Authorize(Roles = "patient")]
        [HttpPut("update-info")]
        public async Task<ActionResult> UpdatePatientInfo([FromBody] PatientDTO.PatientUpdateDTO updateInfo)        {
            try
            {
                var userId = HttpContext.Items["UserId"];
                int parsedUserId = Convert.ToInt32(userId.ToString());

                // Tìm patient dựa theo userId
                var patient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.UserId == parsedUserId);

                if (patient == null)
                {
                    return NotFound(new { message = "Không tìm thấy thông tin bệnh nhân" });
                }

                // Cập nhật thông tin
                if (!string.IsNullOrEmpty(updateInfo.Address))
                {
                    patient.Address = updateInfo.Address;
                }

                if (updateInfo.DateOfBirth.HasValue)
                {
                    patient.DateOfBirth = updateInfo.DateOfBirth.Value;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật thông tin thành công" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi cập nhật thông tin bệnh nhân: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi cập nhật thông tin: " + ex.Message });
            }
        }
    }
}