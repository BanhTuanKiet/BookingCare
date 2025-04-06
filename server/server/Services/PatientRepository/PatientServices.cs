using Microsoft.EntityFrameworkCore;
using server.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using server.DTO;

namespace server.Services
{
    public class PatientService : IPatient
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;
        
        public PatientService(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<PatientDTO.PatientBasic>> GetAllPatients()
        {
            var patients = await _context.Patients
                .Include(p => p.User)
                .ToListAsync();

            var patientDTOs = _mapper.Map<List<PatientDTO.PatientBasic>>(patients);
            return patientDTOs;
        }

        public async Task<PatientDTO.PatientDetail> GetPatientById(int patientId)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Appointments)
                .FirstOrDefaultAsync(p => p.PatientId == patientId);

            if (patient == null)
                return null;

            var patientDTO = _mapper.Map<PatientDTO.PatientDetail>(patient);
            return patientDTO;
        }

        public async Task<PatientDTO.PatientDetail> GetPatientByUserId(int userId)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Appointments)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return null;

            var patientDTO = _mapper.Map<PatientDTO.PatientDetail>(patient);
            return patientDTO;
        }

        public async Task<PatientDTO.PatientDetail> GetPatientByUserName(string userName)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Appointments)
                .FirstOrDefaultAsync(p => p.User.UserName == userName);

            var patientDTO = _mapper.Map<PatientDTO.PatientDetail>(patient);
            return patientDTO;
        }

        public async Task<List<PatientDTO.PatientBasic>> SearchPatients(string keyword)
        {
            var patients = await _context.Patients
                .Include(p => p.User)
                .Where(p => p.User.UserName.Contains(keyword) || 
                           p.Address.Contains(keyword))
                .ToListAsync();

            var patientDTOs = _mapper.Map<List<PatientDTO.PatientBasic>>(patients);
            return patientDTOs;
        }

        public async Task<PatientDTO.PatientDetail> CreatePatient(PatientDTO.PatientDetail patientDTO)
        {
            var patient = _mapper.Map<Patient>(patientDTO);
            
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            
            return await GetPatientById(patient.PatientId);
        }

        public async Task<PatientDTO.PatientDetail> UpdatePatient(int patientId, PatientDTO.PatientDetail patientDTO)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            
            if (patient == null)
                return null;
                
            // Update only the fields that should be updated
            patient.DateOfBirth = patientDTO.DateOfBirth;
            patient.Address = patientDTO.Address;
            
            // When updating user-related fields, you may need additional logic here
            
            await _context.SaveChangesAsync();
            
            return await GetPatientById(patientId);
        }

        public async Task<bool> DeletePatient(int patientId)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            
            if (patient == null)
                return false;
                
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
}