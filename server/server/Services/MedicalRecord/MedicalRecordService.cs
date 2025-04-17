using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Models;

namespace server.Services
{
    public class MedicalRecordService : IMedicalRecord
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public MedicalRecordService(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MedicalRecord> AddMedicalRecord(int appointmentId, MedicalRecordDTO.PrescriptionRequest prescriptionRequest)
        {
            var medicalRecord = new MedicalRecord
            {
                AppointmentId = appointmentId,
                Diagnosis = prescriptionRequest.Diagnosis,
                Treatment = prescriptionRequest.Treatment,
                Notes = prescriptionRequest.Notes
            };

            await _context.MedicalRecords.AddAsync(medicalRecord);
            await _context.SaveChangesAsync();

            return medicalRecord;
        }

        public async Task<List<MedicalRecordDetail>> AddMedicalRecordDetail(int recordId, List<MedicalRecordDTO.MedicineDto> medicines)
        {
            var medicalRecordDetail = medicines.Select(medicine => new MedicalRecordDetail
            {
                ReCordId = recordId,
                MedicineId = medicine.MedicineId,
                Quantity = medicine.Quantity,
                Dosage = Int32.Parse(medicine.Dosage),
                FrequencyPerDay = Int32.Parse(medicine.FrequencyPerDay),
                DurationInDays = Int32.Parse(medicine.DurationInDays),
                Usage = medicine.Usage
            }).ToList();

            await _context.MedicalRecordDetails.AddRangeAsync(medicalRecordDetail);
            await _context.SaveChangesAsync();

            return medicalRecordDetail;
        }
    }
}