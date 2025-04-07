using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Models;

namespace server.Services
{
    public class AppointmentServices : IAppointment
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public AppointmentServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<AppointmentDTO.AppointmentDetail>> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Patient.User)
                .Include(a => a.Doctor)
                .Include(a => a.Doctor.User)
                .Include(a => a.Service)
                .ToListAsync();

            // foreach (var a in appointments)
            // {
            //     Console.WriteLine(a.Doctor.User.Id);
            // }

            var appointmentDTOs = _mapper.Map<List<AppointmentDTO.AppointmentDetail>>(appointments);

            return appointmentDTOs;
        }
    }
}
