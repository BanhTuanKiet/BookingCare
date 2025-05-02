using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IMedicalRecord
    {
        Task<MedicalRecord> AddMedicalRecord(int appointmentId, MedicalRecordDTO.PrescriptionRequest prescriptionRequest);
        Task<List<MedicalRecordDetail>> AddMedicalRecordDetail(int recordId, List<MedicalRecordDTO.MedicineDto> medicines);
        Task<List<MedicalRecordDTO.MedicalRecordBasic>> GetMedicalRecords(List<int> appointmentIds);
        Task<List<MedicalRecordDTO.MedicalRecordBasic>> GetRecentMedicalRecords(List<int> appointmentIds);
        Task<List<MedicalRecordDTO.MedicineDto>> GetRecordDetail(int recordId);
        Task<List<PatientDTO.PatientDetail>> GetAllMedicalRecordsAsync();
        Task<List<MedicalRecordDTO.MedicalRecordBasic>> SearchMedicalRecordsAsync(string keyword);
        Task<List<MedicalRecordDTO.MedicalRecordBasic>> GetPatientMedicalRecordsAsync(int patientId);
    }
}