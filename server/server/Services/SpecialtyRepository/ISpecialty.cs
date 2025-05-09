using server.Models;
using Microsoft.AspNetCore.Mvc;

namespace server.Services
{
    public interface ISpecialty
    {
        Task<List<Specialty>> GetSpecialties();
        Task<string?> GetDescription(string specialty);
        Task<List<Specialty>> GetRandomSpecialties();
        Task<Specialty?> GetById(int id);
        Task<Specialty> Create(Specialty specialty);
        Task<bool> Update(int id, Specialty updatedSpecialty);
        Task<bool> Delete(int id);
    }
}