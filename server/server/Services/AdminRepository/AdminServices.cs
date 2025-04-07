using Microsoft.EntityFrameworkCore;
using server.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using server.DTO;

namespace server.Services
{
    public class AdminServices
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;
        public AdminServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // public async Task<List<Appointment>> GetAppointments()
        // {
        //     // var appointments = await _context.Appointments
        //     //     .Include(a => a.Patient)
        //     //     .Include(a => a.Doctor)
        //     //     .Include(a => a.Service)
        //     //     .ToListAsync();

        //     // return appointments;
        // }
    }
}