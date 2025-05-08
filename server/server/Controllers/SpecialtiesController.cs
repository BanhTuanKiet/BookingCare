using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecialty(int id)
        {
            var specialty = await _speciatyService.GetById(id);
            if (specialty == null)
                return NotFound();
            return Ok(specialty);
        }
        
        [Authorize("admin")]
        [HttpPost]
        public async Task<IActionResult> CreateSpecialty(Specialty specialty)
        {
            var result = await _speciatyService.Create(specialty);
            return CreatedAtAction(nameof(GetSpecialty), new { id = result.SpecialtyId }, result);
        }

        [Authorize("admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSpecialty(int id, Specialty specialty)
        {
            var success = await _speciatyService.Update(id, specialty);
            if (!success)
                return NotFound();
            return NoContent();
        }
        [Authorize("admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecialty(int id)
        {
            var success = await _speciatyService.Delete(id);
            if (!success)
                return NotFound();
            return NoContent();
        }

    }
}
