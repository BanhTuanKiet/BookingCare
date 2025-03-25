using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Middleware;

namespace server.Services
{
    public class ServiceServices : IService
    {
        private readonly ClinicManagementContext _context;

        public ServiceServices(ClinicManagementContext context)
        {
            _context = context;
        }

        // Lấy danh sách tất cả dịch vụ
        public async Task<List<Service>> GetAllServices()
        {
            return await _context.Services.Select(s => new Service{ 
                ServiceId = s.ServiceId , 
                ServiceName = s.ServiceName 
            }).ToListAsync();
        }

        // Lấy dịch vụ theo tên
        public async Task<Service?> GetServiceByName(string serviceName)
        {
            return await _context.Services.Where(s => s.ServiceName == serviceName).FirstOrDefaultAsync();
        }

        // public async Task<Service> PostService(Service service)
        // {
        //     _context.Services.Add(service);
        //     await _context.SaveChangesAsync();
        //     return service;
        // }
    }
}