using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace server.Models;

public partial class ServiceRegistration
{
    [Key]  // Explicitly set this as the primary key
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RegistrationId { get; set; }

    public int? PatientId { get; set; }

    public int? ServiceId { get; set; }

    public int? AppointmentId { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public string? Status { get; set; }

    public virtual Appointment? Appointment { get; set; }

    public virtual Patient? Patient { get; set; }

    public virtual Service? Service { get; set; }
}
