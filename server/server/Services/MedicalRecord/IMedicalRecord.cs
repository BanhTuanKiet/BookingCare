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
        Task<MedicalRecordDTO.MedicalRecordBasic> GetMedicalRecordsByRecoredId(int recordId);
        Task<List<MedicalRecordDTO.MedicineDto>> GetRecordDetail(int recordId);
        
    }
}