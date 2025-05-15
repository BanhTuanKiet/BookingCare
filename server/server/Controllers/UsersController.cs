using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDoctor _doctorService;
        private readonly IPatient _patientService;

        public UsersController(ClinicManagementContext context, IUser userService, UserManager<ApplicationUser> userManager, IDoctor doctorService, IPatient patientService)
        {
            _context = context;
            _userService = userService;
            _userManager = userManager;
            _doctorService = doctorService;
            _patientService = patientService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{role}")]
        public async Task<ActionResult> GetUsersByRole(string role)
        {

            if (role == "doctor") 
            {
                var users = await _userService.GetDoctors();
                
                return Ok(users);
            }

            else if (role == "patient")
            {
                var users = await _userService.GetPatients();

                return Ok(users);
            }

            else 
            {
                return Ok("null");
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet("search/{role}/{searchTerm}")]
        public async Task<ActionResult> GetUsersByRole(string role, string searchTerm)
        {
            var users = await _userService.SearchUser(role, searchTerm);

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

        [HttpGet("detail/{userId}")]
        public async Task<ActionResult> GetUserDetail(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            var userRoles = await _userManager.GetRolesAsync(user);

            if (userRoles.Contains("doctor"))
            {
                var doctorDetail = await _doctorService.GetDoctorById(user.Id) ?? throw new ErrorHandlingException(404, "Không tìm thấy chi tiết bác sĩ!");

                return Ok(doctorDetail);
            }
            else if (userRoles.Contains("patient"))
            {
                var patientDetail = await _patientService.GetPatientByUserId(user.Id) ?? throw new ErrorHandlingException(404, "Không tìm thấy chi tiết bệnh nhân");

                return Ok(patientDetail);
            }
            
            return Ok(user);
        }
    }
}