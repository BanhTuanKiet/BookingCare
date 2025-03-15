using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialtiesController : ControllerBase
    {
        private readonly ClinicManagementContext _context;

        public SpecialtiesController(ClinicManagementContext context)
        {
            _context = context;
        }

        // GET: api/Specialties
        [HttpGet]
        public async Task<List<Specialty>> GetSpecialties()
        {
            return await _context.Specialties
                .Select(s => new Specialty { SpecialtyId = s.SpecialtyId, Name = s.Name })
                .ToListAsync();
        }

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

        //// GET: api/Specialties/specialty/doctor
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



        // GET: api/Services
        [HttpGet("{specialty}/services")]

        public async Task<ActionResult<List<object>>> GetAllServices()
        {
            var services = await _context.Services
                .AsNoTracking()
                .Select(sv => new
                {
                    ServiceID = sv.ServiceId,
                    ServiceName = sv.ServiceName,
                    Description = sv.Description,
                    Price = sv.Price,
                })
                .ToListAsync();

            if (!services.Any())
            {
                return NotFound("Không tìm thấy dịch vụ nào!");
            }

            return Ok(services);
        }





        [HttpGet("{id}")]
        public async Task<ActionResult<Specialty>> GetSpecialty(int id)
        {
            var specialty = await _context.Specialties.FindAsync(id);

            if (specialty == null)
            {
                return NotFound();
            }

            return specialty;
        }

        // PUT: api/Specialties/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpecialty(int id, Specialty specialty)
        {
            if (id != specialty.SpecialtyId)
            {
                return BadRequest();
            }

            _context.Entry(specialty).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpecialtyExists(id))
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

        // POST: api/Specialties
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Specialty>> PostSpecialty(Specialty specialty)
        {
            _context.Specialties.Add(specialty);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSpecialty", new { id = specialty.SpecialtyId }, specialty);
        }

        // DELETE: api/Specialty/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecialty(int id)
        {
            var specialty = await _context.Specialties.FindAsync(id);
            if (specialty == null)
            {
                return NotFound();
            }

            _context.Specialties.Remove(specialty);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SpecialtyExists(int id)
        {
            return _context.Specialties.Any(e => e.SpecialtyId == id);
        }
    }
}
