using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IDoctor
    {
        Task<List<DoctorDTO.DoctorBasic>> GetAllDoctors();
        Task<DoctorDTO.DoctorDetail> GetDoctorByName(string doctorName);
        Task<List<DoctorDTO.DoctorBasic>> GetDoctorsBySpecialty(string specialtyName);
        Task<List<DoctorDTO.DoctorBasic>> SearchDoctors(string keyword);
    }
}
