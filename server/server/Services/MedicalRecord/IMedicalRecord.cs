using server.DTO;

namespace server.Services
{
    public interface IMedicalRecord
    {
        Task<bool> AddMedicalRecordAsync(int appointmentId, MedicalRecordDTO.PrescriptionRequest prescriptionRequest);
    }
}