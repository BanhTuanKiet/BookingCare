using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IPatient
    {
        Task<List<PatientDTO.PatientBasic>> GetAllPatients();
        Task<PatientDTO.PatientBasic> GetPatientById(int patientId);
        //Task<PatientDTO.PatientDetail> GetPatientById(int patientId);
        Task<PatientDTO.PatientDetail> GetPatientByUserId(int userId);
        Task<PatientDTO.PatientDetail> GetPatientByUserName(string userName);
        Task<List<PatientDTO.PatientBasic>> SearchPatients(string keyword);
        Task<PatientDTO.PatientDetail> CreatePatient(PatientDTO.PatientDetail patientDTO);
        Task<PatientDTO.PatientDetail> UpdatePatient(int patientId, PatientDTO.PatientDetail patientDTO);
        Task<bool> DeletePatient(int patientId);
    }
}
