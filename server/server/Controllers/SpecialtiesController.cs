using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using server.Middleware;
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
        public async Task<IActionResult> GetDescription(string specialty)
        {
            try
            {
                var description = await _context.Specialties
                     .Where(s => s.Name == specialty)
                     .Select(s => s.Description)
                     .FirstOrDefaultAsync();

                if (description == null)
                {
                    throw new ErrorHandlingException("Không tìm thấy chuyên khoa!");
                }

                return Ok(description);
            }
            catch (Exception ex)
            {
                if (ex is ErrorHandlingException) throw;
                
                throw new ErrorHandlingException(ex.Message);
            }
        }


        //// GET: api/Specialties/specialty/doctor
        [HttpGet("{specialty}/doctor")]
        public async Task<IActionResult> GetDoctors(string specialty)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(specialty))
                {
                    throw new ErrorHandlingException(500, "Tên chuyên khoa không hợp lệ!");
                }

                var doctors = await (
                    from d in _context.Doctors
                    join u in _context.Users on d.UserId equals u.UserId
                    join s in _context.Specialties on d.SpecialtyId equals s.SpecialtyId
                    where s.Name.Trim().ToLower() == specialty.Trim().ToLower()
                    select new
                    {
                        DoctorId = d.DoctorId,
                        ExperienceYears = d.ExperienceYears,
                        SpecialtyId = d.SpecialtyId,
                        UserId = d.UserId,
                        UserName = u.FullName,
                        Degree = d.Degree,
                        Position = d.Position,
                        DoctorImage = d.DoctorImage != null ? $"data:image/png;base64,{Convert.ToBase64String(d.DoctorImage)}" : null
                    }).ToListAsync();

                if (!doctors.Any())
                {
                    throw new ErrorHandlingException(500, "Lỗi lấy bác sĩ theo khoa");
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                if (ex is ErrorHandlingException)
                {
                    throw;
                }

                throw new ErrorHandlingException(ex.Message);
            }
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
    }
}
