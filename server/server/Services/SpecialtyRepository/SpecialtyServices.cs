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

        public async Task<List<Specialty>> GetRandomSpecialties()
        {
            return await _context.Specialties.OrderBy(specialty => Guid.NewGuid()).Take(3).ToListAsync();

        }
        
        public async Task<Specialty?> GetById(int id)
        {
            return await _context.Specialties.FindAsync(id);
        }

        public async Task<Specialty> Create(Specialty specialty)
        {
            _context.Specialties.Add(specialty);
            await _context.SaveChangesAsync();
            return specialty;
        }

        public async Task<bool> Update(int id, Specialty updatedSpecialty)
        {
            var existing = await _context.Specialties.FindAsync(id);
            if (existing == null) return false;

            existing.Name = updatedSpecialty.Name;
            existing.Description = updatedSpecialty.Description;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var specialty = await _context.Specialties.FindAsync(id);
            if (specialty == null) return false;

            _context.Specialties.Remove(specialty);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
