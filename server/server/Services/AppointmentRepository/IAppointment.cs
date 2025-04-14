using server.DTO;
using server.Models;

namespace server.Services
{
    public interface IAppointment
    {
        Task<List<AppointmentDTO.AppointmentDetail>> GetAppointments();
        Task<List<AppointmentDTO.AppointmentDetail>> GetAppointmentByPatientId(int? patientId);
        Task<Appointment> GetAppointmentById(int appointmentId);
        Task UpdateStatus(Appointment appointment, string newStatus);
        void CancelAppointment(Appointment appointment);
        Task<List<AppointmentDTO.DoctorScheduleDTO>> GetDoctorSchedule(int? doctorId);

    }
}
