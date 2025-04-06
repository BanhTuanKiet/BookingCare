using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IPatient
    {
        Task<PatientDTO.PatientBasic> GetPatientById(int patientId);
    }
}