using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IAdmin
    {
        Task<List<Appointment>> GetAppointments();
    }
}
