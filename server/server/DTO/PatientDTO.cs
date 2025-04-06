namespace server.DTO
{
    public class PatientDTO
    {
        public class PatientBasic
        {
            public int PatientId { get; set; }
            public int? UserId { get; set; }
            public string? UserName { get; set; }
            public DateOnly? DateOfBirth { get; set; }
            public string? Address { get; set; }
        }

        public class PatientDetail : PatientBasic
        {
            public string? Email { get; set; }
            public string? PhoneNumber { get; set; }
            public List<AppointmentDTO>? Appointments { get; set; }
            
        }

        // This class can be created if you have AppointmentDTO defined elsewhere
        public class AppointmentDTO
        {
            public int AppointmentId { get; set; }
            public DateTime? AppointmentDate { get; set; }
            public string? Status { get; set; }
            public string? DoctorName { get; set; }
        }
    }
}