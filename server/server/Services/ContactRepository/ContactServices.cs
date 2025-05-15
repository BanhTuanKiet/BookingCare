using Microsoft.EntityFrameworkCore;
using server.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using server.DTO;

namespace server.Services
{
    public class ContactServices : IContact
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;
        public ContactServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ContactMessages> SendMessage(ContactMessages contactMessages)
        {
            var contact = await _context.AddAsync(contactMessages);
            await _context.SaveChangesAsync();
            return contact.Entity;
        }
    }
   
}