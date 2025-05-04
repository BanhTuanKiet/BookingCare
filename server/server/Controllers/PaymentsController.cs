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
        
        [HttpGet("payment")]
        public ActionResult GetAllRevenue()
        {
            var payments = _context.Payments.AsQueryable();
            Console.WriteLine("aaaaaaa");

            // Doanh thu theo ngày
            var daily = payments
                .GroupBy(p => p.PaymentDate.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"),
                    Total = g.Sum(p => p.Amount)
                })
                .ToList();

            // Doanh thu theo tháng
            var monthly = payments
                .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
                .Select(g => new
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Total = g.Sum(p => p.Amount)
                })
                .ToList();

            // Doanh thu theo quý
            var quarterly = payments
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

            // Doanh thu theo năm
            var yearly = payments
                .GroupBy(p => p.PaymentDate.Year)
                .Select(g => new
                {
                    Year = g.Key,
                    Total = g.Sum(p => p.Amount)
                })
                .ToList();

            return Ok(new
            {
                Daily = daily,
                Monthly = monthly,
                Quarterly = quarterly,
                Yearly = yearly
            });
        }

        // [HttpGet("daily")]
        // public IActionResult GetDailyRevenue()
        // {
        //     var revenue = _context.Payments
        //         // .Where(p => p.Status == "Completed")
        //         .GroupBy(p => p.PaymentDate.Date)
        //         .Select(g => new
        //         {
        //             Date = g.Key.ToString("yyyy-MM-dd"),
        //             Total = g.Sum(p => p.Amount)
        //         })
        //         .ToList();

        //     return Ok(revenue);
        // }

        // [HttpGet("monthly")]
        // public IActionResult GetMonthlyRevenue()
        // {
        //     var revenue = _context.Payments
        //         // .Where(p => p.Status == "Completed")
        //         .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
        //         .Select(g => new
        //         {
        //             Month = $"{g.Key.Year}-{g.Key.Month:D2}",
        //             Total = g.Sum(p => p.Amount)
        //         })
        //         .ToList();

        //     return Ok(revenue);
        // }

        // [HttpGet("quarterly")]
        // public IActionResult GetQuarterlyRevenue()
        // {
        //     var revenue = _context.Payments
        //         // .Where(p => p.Status == "Completed")
        //         .GroupBy(p => new
        //         {
        //             p.PaymentDate.Year,
        //             Quarter = (p.PaymentDate.Month - 1) / 3 + 1
        //         })
        //         .Select(g => new
        //         {
        //             Quarter = $"Q{g.Key.Quarter}-{g.Key.Year}",
        //             Total = g.Sum(p => p.Amount)
        //         })
        //         .ToList();

        //     return Ok(revenue);
        // }

        // [HttpGet("yearly")]
        // public IActionResult GetYearlyRevenue()
        // {
        //     var revenue = _context.Payments
        //         // .Where(p => p.Status == "Completed")
        //         .GroupBy(p => p.PaymentDate.Year)
        //         .Select(g => new
        //         {
        //             Year = g.Key,
        //             Total = g.Sum(p => p.Amount)
        //         })
        //         .ToList();

        //     return Ok(revenue);
        // }
    }
}