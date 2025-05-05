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

    public class DepartmentRatingDTO
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public double AvgKnowledge { get; set; }
        public double AvgAttitude { get; set; }
        public double AvgDedication { get; set; }
        public double AvgCommunicationSkill { get; set; }
        public double OverallAverage => Math.Round((AvgKnowledge + AvgAttitude + AvgDedication + AvgCommunicationSkill) / 4, 2);
    }
}
