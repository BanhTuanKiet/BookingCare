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

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly IService _serviceService;


        public ServicesController(ClinicManagementContext context, IService serviceService)
        {
            _context = context;
            _serviceService = serviceService;
        }

        // GET: Services
        [HttpGet]
        public async Task<List<ServiceDTO.ServiceDetail>> GetService()
        {
            var service = await _serviceService.GetAllServices();
             Console.WriteLine(service);
             return service;
        }

        // GET: ServicesByName
        [HttpGet("detail/{serviceName}")]
        public async Task<IActionResult> GetServiceByName(string serviceName)
        {

            if (string.IsNullOrEmpty(serviceName))
            {
                throw new ErrorHandlingException(500, "Service Name is required!");
            }

            ServiceDTO.ServiceDetail service = await _serviceService.GetServiceByName(serviceName) ?? throw new ErrorHandlingException(500, "Lỗi lấy dịch vụ theo tên");
            
            return Ok(service);
        }
        
        [HttpGet("{specialty}/services")]
        public async Task<ActionResult<List<ServiceDTO.ServiceDetail>>> GetServiceBySpecialtyName(string specialty)
        {
            if (string.IsNullOrEmpty(specialty))
            {
                throw new ErrorHandlingException(500, "Specialty name is required!");
            }
            
            var services = await _serviceService.GetServiceBySpecialty(specialty) ?? throw new ErrorHandlingException(500, "Lỗi lấy dịch vụ theo khoa");

            return Ok(services);
        }

        // [HttpGet("{specialty}/services")]
        // public async Task<ActionResult<List<ServiceDTO.ServiceDetail>>> GetAllServices()
        // {
        //     var services = await _context.Services.ToListAsync();

        //     var serviceDTOs = _map

        //     var services = await _context.Services
        //         .AsNoTracking()
        //         .Select(sv => new
        //         {
        //             ServiceID = sv.ServiceId,
        //             ServiceName = sv.ServiceName,
        //             Description = sv.Description,
        //             Price = sv.Price,
        //         })
        //         .ToListAsync();

        //     if (!services.Any())
        //     {
        //         return NotFound("Không tìm thấy dịch vụ nào!");
        //     }

        //     return Ok(services);
        // }

        // POST: Services
        // [HttpPost]
        // public async Task<ActionResult<Service>> PostService(Service service)
        // {
        //     _context.Services.Add(service);
        //     await _context.SaveChangesAsync();
        //     return CreatedAtAction("GetService", new { id = service.ServiceId }, service);
        // }

        // // PUT: Services/{id}
        // [HttpPut("{id}")]
        // public async Task<IActionResult> PutService(int id, Service service)
        // {
        //     if (id != service.ServiceId)
        //     {
        //         return BadRequest();
        //     }

        //     _context.Entry(service).State = EntityState.Modified;
        //     try
        //     {
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         if (!ServiceExists(id))
        //         {
        //             return NotFound();
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }
        //     return NoContent();
        // }

        // // DELETE: Services/{id}
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteService(int id)
        // {
        //     var service = await _context.Services.FindAsync(id);
        //     if (service == null)
        //     {
        //         return NotFound();
        //     }
        //     _context.Services.Remove(service);
        //     await _context.SaveChangesAsync();
        //     return NoContent();
        // }

        // private bool ServiceExists(int id)
        // {
        //     return _context.Services.Any(e => e.ServiceId == id);
        // }
    }
}
