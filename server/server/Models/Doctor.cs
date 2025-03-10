using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Doctor
{
    public int DoctorId { get; set; }

    public int? UserId { get; set; }

    public int? SpecialtyId { get; set; }

    public int? ExperienceYears { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual Specialty? Specialty { get; set; }

    public virtual User? User { get; set; }
}
