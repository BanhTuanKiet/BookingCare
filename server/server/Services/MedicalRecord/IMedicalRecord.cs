using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IMedicalRecord
    {
        Task<MedicalRecord> AddMedicalRecord(int appointmentId, MedicalRecordDTO.PrescriptionRequest prescriptionRequest);
        Task<List<MedicalRecordDetail>> AddMedicalRecordDetail(int recordId, List<MedicalRecordDTO.MedicineDto> medicines);

    }
}