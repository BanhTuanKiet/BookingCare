using server.Models;

namespace server.Services.Specialty
{
    public class SpecialtyServices : ISpecialty
    {
        public Task<List<Models.Service>> GetAllServices()
        {
            throw new NotImplementedException();
        }

        public Task<string?> GetDescription(string specialty)
        {
            throw new NotImplementedException();
        }

        public Task<List<Doctor>> GetDoctors(string specialty)
        {
            throw new NotImplementedException();
        }

        public Task<List<Models.Specialty>> GetSpecialties()
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateSpecialty(int id, Models.Specialty specialty)
        {
            throw new NotImplementedException();
        }
    }
}
