    using server.DTO;
    using server.Models;

    namespace server.Services
    {
        public interface IUser
        {
            Task<List<UserDTO.UserBasic>> GetAllUsers();
            Task<UserDTO.UserBasic> GetUserById(int id, string role);
            Task<List<UserDTO.UserBasic>> SearchUsers(string keyword);
        }
    }
