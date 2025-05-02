    using server.DTO;
    using server.Models;

    namespace server.Services
    {
        public interface IUser
        {
            Task<UserDTO.UserBasic> GetUserById(int id, string role);
            Task<List<UserDTO.UserBasic>> GetUsers();
        }
    }
