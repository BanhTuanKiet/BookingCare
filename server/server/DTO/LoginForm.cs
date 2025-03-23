using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace server.Models;

public partial class LoginForm
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}
