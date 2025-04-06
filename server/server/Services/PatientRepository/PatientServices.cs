using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Models;

namespace server.Services
{
    public class PatientServices : IPatient
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public PatientServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PatientDTO.PatientBasic> GetPatientById(int patientId)
        {
            var patient = await _context.Patients.Include(p => p.User).FirstOrDefaultAsync(d => d.UserId == patientId);

            var patientDTO = _mapper.Map<PatientDTO.PatientBasic>(patient);

            return patientDTO;
        }

    }
}
