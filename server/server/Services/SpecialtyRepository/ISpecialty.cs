using server.Models;
using Microsoft.AspNetCore.Mvc;

namespace server.Services
{
    public interface ISpecialty
    {
        Task<List<server.Models.Specialty>> GetSpecialties();
        Task<string?> GetDescription(string specialty);
    }
}