using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Services
{
    public class SpecialtyServices : ISpecialty
    {
        private readonly ClinicManagementContext _context;

        public SpecialtyServices(ClinicManagementContext context)
        {
            _context = context;
        }
        public async Task<List<Specialty>> GetSpecialties()
        {
            return await _context.Specialties.ToListAsync();
        }

        public async Task<string?> GetDescription(string specialty)
        {
            var description = await _context.Specialties.Where(s => s.Name == specialty).Select(s => s.Description).FirstOrDefaultAsync();

            return description;
        }
    }
}
