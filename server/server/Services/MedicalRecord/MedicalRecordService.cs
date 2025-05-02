using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Middleware;
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

        public async Task<List<MedicalRecordDTO.MedicalRecordBasic>> GetMedicalRecords(List<int> appointmentIds)
        {
            var medicalRecords = await _context.MedicalRecords
                .Include(mr => mr.Appointment)
                .Include(mr => mr.Appointment.Doctor.User)
                .Include(mr => mr.Appointment.Doctor.Specialty)
                .Include(mr => mr.Appointment.Service)
                .Where(mr => appointmentIds.Contains(mr.AppointmentId ?? 0))
                .OrderBy(mr => mr.Appointment.AppointmentDate)
                .ToListAsync() ?? throw new ErrorHandlingException("Lỗi khi lấy danh sách toa thuốc!");

            var medicalRecordDTOs = _mapper.Map<List<MedicalRecordDTO.MedicalRecordBasic>>(medicalRecords);

            return medicalRecordDTOs;  
        }

        public async Task<List<MedicalRecordDTO.MedicalRecordBasic>> GetRecentMedicalRecords(List<int> appointmentIds)
        {
            var medicalRecords = await _context.MedicalRecords
                .Include(mr => mr.Appointment)
                .Include(mr => mr.Appointment.Doctor.User)
                .Include(mr => mr.Appointment.Doctor.Specialty)
                .Include(mr => mr.Appointment.Service)
                .Where(mr => appointmentIds.Contains(mr.AppointmentId ?? 0))
                .OrderBy(mr => mr.Appointment.AppointmentDate)
                .Take(3)
                .ToListAsync();
            
            var medicalRecordDTOs = _mapper.Map<List<MedicalRecordDTO.MedicalRecordBasic>>(medicalRecords);

            return medicalRecordDTOs;  
        }


        public async Task<List<MedicalRecordDTO.MedicalRecordBasic>> SearchMedicalRecordsAsync(string keyword)
        {
            var medicalRecords = await _context.MedicalRecords
                .Include(mr => mr.Appointment)
                .Include(mr => mr.Appointment.Doctor.User)
                .Include(mr => mr.Appointment.Patient.User)
                .Include(mr => mr.Appointment.Doctor.Specialty)
                .Include(mr => mr.Appointment.Service)
                .Where(mr =>
                    mr.Appointment.Patient.User.FullName.Contains(keyword) ||
                    mr.Appointment.Doctor.User.FullName.Contains(keyword) ||
                    mr.Diagnosis.Contains(keyword))
                .OrderBy(mr => mr.Appointment.AppointmentDate)
                .ToListAsync() ?? throw new ErrorHandlingException("Lỗi khi lấy danh sách toa thuốc theo keyword!");

            var medicalRecordDTOs = _mapper.Map<List<MedicalRecordDTO.MedicalRecordBasic>>(medicalRecords);

            return medicalRecordDTOs;  
        }

public async Task<List<MedicalRecordDTO.MedicalRecordBasic>> GetPatientMedicalRecordsAsync(int patientId)
        {
            var medicalRecords = await _context.MedicalRecords
                .Include(mr => mr.Appointment)
                .Include(mr => mr.Appointment.Doctor.User)
                .Include(mr => mr.Appointment.Doctor.Specialty)
                .Include(mr => mr.Appointment.Patient.User)
                .Include(mr => mr.Appointment.Service)
                .Where(mr => mr.Appointment != null 
                             && mr.Appointment.Patient != null 
                             && mr.Appointment.Patient.PatientId == patientId)
                .OrderBy(mr => mr.Appointment.AppointmentDate)
                .ToListAsync() ?? throw new ErrorHandlingException("Lỗi khi lấy danh sách toa thuốc theo mã bệnh nhân!");

            var medicalRecordDTOs = _mapper.Map<List<MedicalRecordDTO.MedicalRecordBasic>>(medicalRecords);

            return medicalRecordDTOs;  
        }

        public async Task<List<PatientDTO.PatientDetail>> GetAllMedicalRecordsAsync()
        {
            var users = await _context.MedicalRecords
                .Include(mr => mr.Appointment)
                    .ThenInclude(a => a.Patient.User)
                .Where(mr => mr.Appointment.Patient.PatientId != null)
                .Select(mr => mr.Appointment.Patient.User.Patient)
                .Distinct()
                .ToListAsync() ?? throw new ErrorHandlingException("Lỗi khi lấy danh sách người dùng có toa thuốc!");

            var userDTOs = _mapper.Map<List<PatientDTO.PatientDetail>>(users);

            return userDTOs;
        }


        public async Task<List<MedicalRecordDTO.MedicineDto>> GetRecordDetail(int recordId)
        {
            var medicines = await _context.MedicalRecordDetails
                .Include(mr => mr.Medicine)
                .Where(mr => mr.ReCordId == recordId)
                .ToListAsync();

            var medicineDTOs = _mapper.Map<List<MedicalRecordDTO.MedicineDto>>(medicines);

            return medicineDTOs;
        }
    }
}