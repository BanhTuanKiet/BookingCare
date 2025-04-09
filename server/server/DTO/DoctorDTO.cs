namespace server.DTO
{
    public class DoctorDTO
    {
        public class DoctorBasic
        {
            public int? DoctorId { get; set; }
            public int? SpecialtyId { get; set; }
            public string? UserName { get; set; }
            public string? Position { get; set; }
            public int? ExperienceYears { get; set; }
            public string? DoctorImage { get; set; }
            public string? Degree { get; set; }
        }

        public class DoctorDetail
        {
            public int? DoctorId { get; set; }
            public int? SpecialtyId { get; set; }
            public int? UserId { get; set; }
            public string? UserName { get; set; }
            public string? Degree { get; set; }
            public string? Position { get; set; }
            public string? Biography { get; set; }
            public string? Qualifications { get; set; }
            public string? WorkExperience { get; set; }
            public int? ExperienceYears { get; set; }
            public string? DoctorImage { get; set; }
            public string? Email { get; set; }
        }
    }
}
