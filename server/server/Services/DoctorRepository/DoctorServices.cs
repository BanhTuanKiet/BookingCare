using Microsoft.EntityFrameworkCore;
using server.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using server.DTO;

namespace server.Services
{
    public class DoctorServices : IDoctor
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;
        public DoctorServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<DoctorDTO.DoctorBasic>> GetAllDoctors()
        {
            var doctors = await _context.Doctors.Include(doctor => doctor.User).ToListAsync();

            var doctorDTOs = _mapper.Map<List<DoctorDTO.DoctorBasic>>(doctors);
            return doctorDTOs;
        }

        public async Task<DoctorDTO.DoctorDetail> GetDoctorByName(string doctorName)
        {
            var doctor = await _context.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.User.FullName == doctorName);

            var doctorDTO = _mapper.Map<DoctorDTO.DoctorDetail>(doctor);

            return doctorDTO;
        }

        public async Task<List<DoctorDTO.DoctorBasic>> GetDoctorsBySpecialty(string specialtyName)
        {
            var doctors = await _context.Doctors.Include(doctor => doctor.User).Where(d => d.Specialty.Name == specialtyName).ToListAsync();

            var doctorDTOs = _mapper.Map<List<DoctorDTO.DoctorBasic>>(doctors);

            return doctorDTOs;
        }

        public async Task<List<DoctorDTO.DoctorBasic>> SearchDoctors(string keyword)
        {
            var doctors = await _context.Doctors.Include(d => d.User).Where(d => d.User.UserName.Contains(keyword)).ToListAsync();

            var doctorDTOs = _mapper.Map<List<DoctorDTO.DoctorBasic>>(doctors);

            return doctorDTOs;
        }
    }
}