using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly IDoctor _doctorService;

        public DoctorsController(ClinicManagementContext context, IDoctor doctorService)
        {
            _context = context;
            _doctorService = doctorService;
        }
        
        [HttpGet]
        public async Task<ActionResult<List<DoctorDTO.DoctorBasic>>> GetAllDoctors()
        {
            return await _doctorService.GetAllDoctors();
        }


        [HttpGet("detail/{doctorName}")]
        public async Task<ActionResult<DoctorDTO.DoctorDetail>> GetDoctorByName(string doctorName)
        {
            if (string.IsNullOrEmpty(doctorName))
            {
                throw new ErrorHandlingException(500, "UserName is required");
            }

            DoctorDTO.DoctorDetail doctor = await _doctorService.GetDoctorByName(doctorName);

            return Ok(doctor);
        }

        // [HttpGet("{id}")]
        // public async Task<ActionResult<Doctor>> GetDoctor(int id)
        // {
        //     var doctor = await _context.Doctors.FindAsync(id);
        //     if (doctor == null)
        //     {
        //         return NotFound();
        //     }
        //     return doctor;
        // }

        [HttpGet("{specialty}")]
        public async Task<ActionResult<List<DoctorDTO.DoctorBasic>>> GetDoctorsBySpecialty(string specialty)
        {
            List<DoctorDTO.DoctorBasic> doctors = await _doctorService.GetDoctorsBySpecialty(specialty);

            return Ok(doctors);
        }

        /// <summary>
        /// Tìm kiếm bác sĩ theo từ khóa (tên)
        /// GET: api/doctors/search?keyword=abc
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<DoctorDTO.DoctorBasic>> SearchDoctors([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest("Keyword is required");

            List<DoctorDTO.DoctorBasic> doctors = await _doctorService.SearchDoctors(keyword);

            return Ok(doctors);
        }

        [HttpPost("upload")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> Upload([FromForm] IFormFile file, [FromForm] int doctorId)
        {
            try
            {
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);
                var imageData = memoryStream.ToArray();

                Doctor doctor = await _context.Doctors.FindAsync(doctorId);
                if (doctor == null)
                {
                    return NotFound("Doctor not found.");
                }

                doctor.DoctorImage = imageData;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Image uploaded successfully." });
            }
            catch (ErrorHandlingException ex)
            {
                if (ex is ErrorHandlingException) throw;

                throw new ErrorHandlingException(500, ex.Message);
            }
        }
    }
}
