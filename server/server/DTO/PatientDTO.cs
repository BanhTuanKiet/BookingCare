namespace server.DTO
{
    public class PatientDTO
    {
        public class PatientBasic
        {
            public int? PatientId { get; set; }
            public string? UserName { get; set; }
            public DateOnly? DateOfBirth { get; set; }
        }
    }
}
