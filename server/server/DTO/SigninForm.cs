using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server.Models
{
    public class SigninForm
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
