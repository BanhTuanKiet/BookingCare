using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using server.Middleware;
using server.Models;
using server.Services;
using server.DTO;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    // [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly ClinicManagementContext _context;

        public PaymentsController(ClinicManagementContext context)
        {
            _context = context;
        }

        // Lấy danh sách revenue tổng quát từ DB
        // Cập nhật GetRevenueData
        private List<RevenueDTO> GetRevenueData()
        {
            var appointments = _context.Appointments
                .Include(a => a.Service)
                .Where(a => a.Status == "Đã khám" && a.AppointmentDate != null)
                .ToList();

            var medicalRecords = _context.MedicalRecords.ToList();

            return appointments.Select(a =>
            {
                var servicePrice = a.Service?.Price ?? 0;
                var medRecordPrice = medicalRecords
                    .Where(mr => mr.AppointmentId == a.AppointmentId)
                    .Sum(mr => mr.Price ?? 0);

                return new RevenueDTO
                {
                    PaymentDate = a.AppointmentDate.Value,
                    Amount = servicePrice + medRecordPrice
                };
            }).ToList();
        }


        [HttpGet("daily")]
        public ActionResult GetDailyRevenue()
        {
            var revenues = GetRevenueData();
            var daily = revenues
                .GroupBy(p => p.PaymentDate.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Total = g.Sum(p => p.Amount)
                })
                .ToList();

            return Ok(daily);
        }

        [HttpGet("monthly")]
        public ActionResult GetMonthlyRevenue()
        {
            var revenues = GetRevenueData();
            var monthly = revenues
                .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
                .Select(g => new
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Total = g.Sum(p => p.Amount)
                })
                .ToList();

            return Ok(monthly);
        }

        [HttpGet("quarterly")]
        public ActionResult GetQuarterlyRevenue()
        {
            var revenues = GetRevenueData();
            var quarterly = revenues
                .GroupBy(p => new
                {
                    p.PaymentDate.Year,
                    Quarter = (p.PaymentDate.Month - 1) / 3 + 1
                })
                .Select(g => new
                {
                    Quarter = $"Q{g.Key.Quarter}-{g.Key.Year}",
                    Total = g.Sum(p => p.Amount)
                })
                .ToList();

            return Ok(quarterly);
        }

        [HttpGet("yearly")]
        public ActionResult GetYearlyRevenue()
        {
            var revenues = GetRevenueData();
            var yearly = revenues
                .GroupBy(p => p.PaymentDate.Year)
                .Select(g => new
                {
                    Year = g.Key,
                    Total = g.Sum(p => p.Amount)
                })
                .ToList();

            return Ok(yearly);
        }
    }
}