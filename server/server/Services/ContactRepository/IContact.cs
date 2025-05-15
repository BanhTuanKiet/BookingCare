using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IContact
    {
        Task<ContactMessages> SendMessage(ContactMessages contactMessages);
    }
}
