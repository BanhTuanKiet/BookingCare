using server.Models;
using Microsoft.AspNetCore.Mvc;

namespace server.Services
{
    public interface ISpecialty
    {
        Task<List<Specialty>> GetSpecialties();
        Task<string?> GetDescription(string specialty);
        Task<List<Specialty>> GetRandomSpecialties();
    }
}