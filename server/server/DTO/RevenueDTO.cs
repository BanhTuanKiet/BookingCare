using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace server.DTO;

public class RevenueDTO
{
    public DateTime PaymentDate { get; set; }
    public float Amount { get; set; }
}
