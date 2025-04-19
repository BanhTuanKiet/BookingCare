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
        Task<List<AppointmentDTO.AppointmentDetail>> GetDoctorScheduleDetail(int? doctorId, string date, string time);
        Task<List<AppointmentDTO.AppointmentDetail>> GetPatientScheduleDetail(int? doctorId);
        Task<List<int>> GetAppointmentsId(int? patientId);

    }
}
