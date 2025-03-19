using server.Models;

namespace server.Services
{
    public interface ISpecialty
    {
        Task<List<server.Models.Specialty>> GetSpecialties();
        Task<string?> GetDescription(string specialty);
        Task<List<Doctor>> GetDoctors(string specialty);
        Task<List<server.Models.Service>> GetAllServices();
        Task<bool> UpdateSpecialty(int id, server.Models.Specialty specialty);
    }
}