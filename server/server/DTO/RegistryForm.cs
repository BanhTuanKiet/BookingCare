using Microsoft.AspNetCore.Identity;

namespace server.DTO
{
    public class RegistryForm
    {
        public string? email { get; set; }
        public string? fullname { get; set; }
        public string? password { get; set; }
        public string? passwordConfirmed { get; set; }
        public string? phone { get; set; }
    }
}