namespace server.DTO
{
    public class ReviewDTO
    {
        public int RecordId { get; set; }
        public int OverallRating { get; set; }
        public string? Comment { get; set; }
        public int Knowledge { get; set; }
        public int Attitude { get; set; }
        public int Dedication { get; set; }
        public int CommunicationSkill { get; set; }
        public int Effectiveness { get; set; }
        public int Price { get; set; }
        public int ServiceSpeed { get; set; }
        public int Convenience { get; set; }
    }
    
    public class ServiceReview
    {
        public int ReviewId { get; set; }
        public int RecordId { get; set; }
        public int OverallRating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? PatientName { get; set; }
        public string? ServiceName { get; set; }
    }

    public class DoctorReviewDetails
    {
        public int? DoctorId { get; set; }
        public int? SpecialtyId { get; set; }
        public string? UserName { get; set; }
        public string? Position { get; set; }
        public int? ExperienceYears { get; set; }
        public string? DoctorImage { get; set; }
        public string? Degree { get; set; }
        public double AvgKnowledge { get; set; }
        public double AvgAttitude { get; set; }
        public double AvgDedication { get; set; }
        public double AvgCommunicationSkill { get; set; }
        public double OverallAverage => Math.Round((AvgKnowledge + AvgAttitude + AvgDedication + AvgCommunicationSkill) / 4, 2);
    }

    public class DepartmentRatingsDTO
    {
        public string DepartmentName { get; set; } = string.Empty;
        public List<DoctorReviewDetails> TopDoctors { get; set; } = new();
    }
    public class ServiceReviewBasic
    {
        public int ServiceId { get; set; }
        public double AvgScore { get; set; }
        public int ReviewCount { get; set; }

    }

    public class DoctorReviewBasic
    {
        public int DoctorId { get; set; }
        public double AvgScore { get; set; }
        public int ReviewCount { get; set; }
    }

    public class DoctorReviewDetailDTO
    {
        public int ReviewId { get; set; }
        public int MedicalRecordId { get; set; }
        public int OverallRating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Knowledge { get; set; }
        public int Attitude { get; set; }
        public int Dedication { get; set; }
        public int CommunicationSkill { get; set; }
        public string? PatientName { get; set; }
    }

    public class ReviewRating
    {
        public int Rating { get; set; }
        public int ReviewCount { get; set; }
    }
}