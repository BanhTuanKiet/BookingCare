using server.Models;
using Microsoft.AspNetCore.Mvc;

namespace server.Services
{
    public interface ISpecialty
    {
        Task<List<server.Models.Specialty>> GetSpecialties();
        Task<string?> GetDescription(string specialty);
        Task<Specialty?> GetById(int id);
        Task<Specialty> Create(Specialty specialty);
        Task<bool> Update(int id, Specialty updatedSpecialty);
        Task<bool> Delete(int id);
    }
}