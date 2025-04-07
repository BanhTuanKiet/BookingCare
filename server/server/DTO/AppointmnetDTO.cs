namespace server.DTO
{
    public class AppointmentDTO
    {
        // public class DoctorBasic
        // {
        //     public int? DoctorId { get; set; }
        //     public int? SpecialtyId { get; set; }
        //     public string? UserName { get; set; }
        //     public string? Position { get; set; }
        //     public int? ExperienceYears { get; set; }
        //     public string? DoctorImage { get; set; }
        //     public string? Degree { get; set; }
        // }

        public class AppointmentDetail
        {
            public int? AppointmentId { get; set; }
            public string? PatientName { get; set; }
            public string? DoctorName { get; set; }
            public string? ServiceName { get; set; }
            public string? AppointmentDate { get; set; }
            public string? Status { get; set; }
        }
    }
}
