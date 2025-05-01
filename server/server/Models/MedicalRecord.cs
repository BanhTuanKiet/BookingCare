using System;
using System.Collections.Generic;

namespace server.Models;

public partial class MedicalRecord
{
    public int RecordId { get; set; }

    public int? AppointmentId { get; set; }

    public string? Diagnosis { get; set; }

    public string? Treatment { get; set; }

    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public virtual Appointment? Appointment { get; set; }
    public virtual Review? Review { get; set; }  // 👈 THÊM DÒNG NÀY

    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
