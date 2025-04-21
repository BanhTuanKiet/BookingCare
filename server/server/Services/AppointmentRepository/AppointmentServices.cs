using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;
using server.DTO;
using server.Middleware;
using server.Models;

namespace server.Services
{
    public class AppointmentServices : IAppointment
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public AppointmentServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Appointment> IsExistAppointment (int? patientId, DateTime appointmentDate, string appointmentTime)
        {
            var appointment = await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentDate == appointmentDate && a.AppointmentTime == appointmentTime && a.Status == "Chờ xác nhận")
                .FirstOrDefaultAsync();

            return appointment;
        }

        public async Task<Appointment> Appointment (int? patientId, int? doctorId, int? serviceId, DateTime appointmentDate, string appointmentTime, string status)
        {
            Appointment appointment = new Appointment
            {
                PatientId = patientId,
                DoctorId = doctorId,
                AppointmentDate = appointmentDate,
                AppointmentTime = appointmentTime,
                ServiceId = serviceId,
                Status = status,
            };

            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();

            return appointment;
        }


        public async Task<List<AppointmentDTO.AppointmentDetail>> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Patient.User)
                .Include(a => a.Doctor)
                .Include(a => a.Doctor.User)
                .Include(a => a.Service)
                .ToListAsync();

            // foreach (var a in appointments)
            // {
            //     Console.WriteLine(a.Doctor.User.Id);
            // }

            var appointmentDTOs = _mapper.Map<List<AppointmentDTO.AppointmentDetail>>(appointments);

            return appointmentDTOs;
        }
        public async Task UpdateStatus(Appointment appointment, string newStatus)
        {
            appointment.Status = newStatus;
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
        }
        public async Task<List<AppointmentDTO.AppointmentDetail>> GetAppointmentByPatientId(int? patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .Include(a => a.Patient)
                .Include(a => a.Patient.User)
                .Include(a => a.Doctor)
                .Include(a => a.Doctor.User)
                .Include(a => a.Service)
                .ToListAsync();

            var appointmentDTOs = _mapper.Map<List<AppointmentDTO.AppointmentDetail>>(appointments);

            return appointmentDTOs;
        }

        public async Task<Appointment> GetAppointmentById(int appointmentId)
        {
            return await _context.Appointments.FindAsync(appointmentId);
        }

        public void CancelAppointment(Appointment appointment)
        {
            appointment.Status = "Đã hủy";
            _context.SaveChangesAsync();
        }

        public async Task<List<AppointmentDTO.DoctorScheduleDTO>> GetDoctorSchedule(int? doctorId)
        {
            var schedule = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && (a.Status == "Đã xác nhận" || a.Status == "Đã khám" || a.Status == "Đã hoàn thành"))
                .ToListAsync();

            var groupedSchedule = schedule
                .GroupBy(a => new
                {
                    Date = a.AppointmentDate.Value.Date,
                    AppointmentTime = a.AppointmentTime
                })
                .Select(g => new AppointmentDTO.DoctorScheduleDTO
                {
                    Date = g.Key.Date,
                    AppointmentTime = g.Key.AppointmentTime,
                    PatientCount = g.Count()
                })
                .OrderBy(g => g.Date)
                .ThenBy(g => g.AppointmentTime)
                .ToList();

            return groupedSchedule;
        }

        public async Task<List<AppointmentDTO.AppointmentDetail>> GetDoctorScheduleDetail(int? doctorId, string date, string time)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Patient.User)
                .Include(a => a.Doctor)
                .Include(a => a.Doctor.User)
                .Include(a => a.Service)
                .Where(a => a.DoctorId == doctorId && a.AppointmentTime == time && a.AppointmentDate == DateTime.Parse(date) && (a.Status == "Đã xác nhận" || a.Status == "Đã khám" || a.Status == "Đã hoàn thành"))

                .ToListAsync();

            var appointmentDTOs = _mapper.Map<List<AppointmentDTO.AppointmentDetail>>(appointments);

            return appointmentDTOs;
        }

        public async Task<List<AppointmentDTO.AppointmentDetail>> GetPatientScheduleDetail(int? doctorId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Patient.User)
                .Include(a => a.Doctor)
                .Include(a => a.Doctor.User)
                .Include(a => a.Service)
                .Where(a => a.DoctorId == doctorId && a.Status == "Đã khám")

                .ToListAsync();

            var appointmentDTOs = _mapper.Map<List<AppointmentDTO.AppointmentDetail>>(appointments);

            return appointmentDTOs;
        }

        public async Task<List<int>> GetAppointmentsId(int? patientId)
        {
            var appointmentIds = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .Select(a => a.AppointmentId)
                .ToListAsync() ?? throw new ErrorHandlingException("Lỗi khi lấy đanh sách lịch hẹn!");

            return appointmentIds;
        }

        public async Task<List<int>> GetRecentAppointmentsId(int? patientId)
        {
            var appointmentIds = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .Take(3)
                .Select(a => a.AppointmentId)
                .ToListAsync() ?? throw new ErrorHandlingException("Lỗi khi lấy đanh sách lịch hẹn!");
            
            return appointmentIds;
        }

        public async Task<AppointmentDTO.AppointmentDetail> GetRecentAppointment(int? patientId)
        {
            var appointment = await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentDate >= DateTime.Now.Date)
                .Include(a => a.Doctor.User)
                .Include(a => a.Service)
                .OrderBy(a => a.AppointmentDate)
                .FirstOrDefaultAsync();

            var appointmentDTO = _mapper.Map<AppointmentDTO.AppointmentDetail>(appointment);

            return appointmentDTO;
        }
    }
}
