using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace server.Models;

public partial class Patient
{
    public int PatientId { get; set; }

    public int? UserId { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Address { get; set; }
    // [JsonIgnore]
    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<ServiceRegistration> ServiceRegistrations { get; set; } = new List<ServiceRegistration>();

    public virtual ApplicationUser? User { get; set; }
}
