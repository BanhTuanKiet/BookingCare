using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IAppointment
    {
        Task<List<AppointmentDTO.AppointmentDetail>> GetAppointments();
        Task<List<AppointmentDTO.AppointmentDetail>> GetAppointmentByPatientId(int? patientId);
    }
}
