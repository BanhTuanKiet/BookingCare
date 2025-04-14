using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Middleware;
using server.Models;

namespace server.Services
{
    public class UserServices : IUser
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public UserServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        
        }
                
        public async Task<UserDTO.UserBasic> GetUserById(int id, string role)
        {
            ApplicationUser user;

            switch (role)
            {
                case "admin":
                    user = await _context.Users.FirstOrDefaultAsync(user => user.Id == id);
                    break;

                case "doctor":
                    user = await _context.Users.FirstOrDefaultAsync(user => user.Id == id);
                    break;

                case "patient":
                    user = await _context.Users.FirstOrDefaultAsync(user => user.Id == id);
                    break;

                default:
                    throw new ErrorHandlingException(403, "Bạn không có quyền truy cập!");
            }

            var userDTO = _mapper.Map<UserDTO.UserBasic>(user);

            return userDTO;
        }
    }
}