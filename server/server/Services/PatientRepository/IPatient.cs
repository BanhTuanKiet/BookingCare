using server.DTO;

namespace server.Services
{
    public interface IPatient
    {
        Task<PatientDTO.PatientBasic> GetPatientById(int patientId);
    }
}
