using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Services
{
    public class AppointmentServices
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public AppointmentServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //[Route()]
        //public Task<ActionResult>()
    }
}
