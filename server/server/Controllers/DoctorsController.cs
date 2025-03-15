using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
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

        //[HttpGet]
        //public async Task<ActionResult<List<Doctor>>> GetDoctors()
        //{
        //    var doctors = await _context.Doctors
        //        .Select(d => new Doctor
        //        {
        //            DoctorId = d.DoctorId,
        //            ExperienceYears = d.ExperienceYears,
        //            SpecialtyId = d.SpecialtyId,
        //            UserId = d.UserId
        //        })
        //        .ToListAsync();

        //    if (doctors == null || !doctors.Any())
        //    {
        //        return NotFound("Không có bác sĩ nào trong hệ thống.");
        //    }

        //    return Ok(doctors);
        //}

        // GET: api/Specialties/specialty/description
        [HttpGet("{specialty}/description")]
        public async Task<ActionResult<string>> GetDescription(string specialty)
        {
            var description = await _context.Specialties
                 .Where(s => s.Name == specialty)
                 .Select(s => s.Description)
                 .FirstOrDefaultAsync();
            if (description == null)
            {
                return NotFound("Không tìm thấy chuyên khoa!");
            }
            return Ok(description);
        }

        // GET: api/Specialties/specialty/doctor
        [HttpGet("{specialty}/doctor")]
        public async Task<ActionResult<List<object>>> GetDoctors(string specialty)
        {
            if (string.IsNullOrWhiteSpace(specialty))
            {
                return BadRequest("Tên chuyên khoa không hợp lệ!");
            }

            var doctors = await (
                from d in _context.Doctors.AsNoTracking()
                join u in _context.Users.AsNoTracking() on d.UserId equals u.UserId
                join s in _context.Specialties.AsNoTracking() on d.SpecialtyId equals s.SpecialtyId
                where s.Name.Trim().ToLower() == specialty.Trim().ToLower()
                select new
                {
                    DoctorId = d.DoctorId,
                    ExperienceYears = d.ExperienceYears,
                    SpecialtyId = d.SpecialtyId,
                    UserId = d.UserId,
                    UserName = u.FullName,
                    Position = d.Position
                }).ToListAsync();

            if (!doctors.Any())
            {
                return NotFound("Không tìm thấy bác sĩ!");
            }

            return Ok(doctors);
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

        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetDoctor", new { id = doctor.DoctorId }, doctor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctor(int id, Doctor doctor)
        {
            if (id != doctor.DoctorId)
            {
                return BadRequest();
            }
            _context.Entry(doctor).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(e => e.DoctorId == id);
        }

    }

}
