namespace server.DTO
{
    public class UserDTO
    {
        public class UserBasic
        {
            public string? UserName { get; set; }
            public DateOnly? DateOfBirth { get; set; }
            public string? Address { get; set; }
            public string? PhoneNumber { get; set; }
            public string? Email { get; set; }
        }
    }
}
