using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using server.Middleware;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialtiesController : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly ISpecialty _speciatyService;

        public SpecialtiesController(ClinicManagementContext context, ISpecialty speciatyService)
        {
            _context = context;
            _speciatyService = speciatyService;
        }

        // GET: api/Specialties
        [HttpGet]
        public async Task<List<Specialty>> GetSpecialties()
        {
            return await _speciatyService.GetSpecialties();

        }

        // GET: api/Specialties/specialty/description
        [HttpGet("{specialty}/description")]
        public async Task<IActionResult> GetDescription(string specialty)
        {
            var description = await _speciatyService.GetDescription(specialty);

            if (string.IsNullOrEmpty(description))
            {
                throw new ErrorHandlingException("Không tìm thấy chuyên khoa!");
            }

            return Ok(description);
        }

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
