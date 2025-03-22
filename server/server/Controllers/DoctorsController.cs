using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using server.Middleware;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly ClinicManagementContext _context;

        public DoctorsController(ClinicManagementContext context)
        {
            _context = context;
        }

        [HttpGet()]
        public async Task<ActionResult<List<Doctor>>> GetAllDoctors()
        {
            return await _context.Doctors.ToListAsync();
        }

        [HttpGet("detail/{doctorName}")]
        public async Task<ActionResult> GetDoctorByName(string doctorName)
        {
            try
            {
                if (string.IsNullOrEmpty(doctorName))
                {
                    throw new ErrorHandlingException(500, "UserName is required");
                }

                var doctors = await (
                    from d in _context.Doctors
                    join u in _context.Users on d.UserId equals u.UserId
                    where u.FullName == doctorName
                    select new
                    {
                        DoctorId = d.DoctorId,
                        ExperienceYears = d.ExperienceYears,
                        SpecialtyId = d.SpecialtyId,
                        UserId = d.UserId,
                        UserName = u.FullName,
                        Degree = d.Degree,
                        Position = d.Position,
                        Biography = d.Biography,
                        Qualifications = d.Qualifications,
                        WorkExperience = d.WorkExperience,
                        DoctorImage = d.DoctorImage != null ? $"data:image/png;base64,{Convert.ToBase64String(d.DoctorImage)}" : null
                    }).FirstOrDefaultAsync();

                if (doctors == null)
                {
                    throw new ErrorHandlingException(404, "Không tìm thấy bác sĩ theo tên");
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                if (ex is ErrorHandlingException)
                {
                    throw;
                }

                throw new ErrorHandlingException(500, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }
            return doctor;
        }

        [HttpGet("specialty/{specialtyId}")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorsBySpecialty(int specialtyId)
        {
            var doctors = await _context.Doctors
                .Where(d => d.SpecialtyId == specialtyId)
                .ToListAsync();

            return Ok(doctors);
        }

        /// <summary>
        /// Tìm kiếm bác sĩ theo từ khóa (tên)
        /// GET: api/doctors/search?keyword=abc
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Doctor>>> SearchDoctors([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest("Keyword is required");

            var doctors = await (
                from d in _context.Doctors
                join u in _context.Users on d.UserId equals u.UserId
                where u.FullName.Contains(keyword)
                select d
            ).ToListAsync();

            return Ok(doctors);
        }

        /// <summary>
        /// Thêm bác sĩ mới
        /// POST: api/doctors
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoctor", new { id = doctor.DoctorId }, doctor);
        }

        [HttpPost("upload")]
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
