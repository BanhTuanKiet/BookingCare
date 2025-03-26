using server.Models;
using server.DTO;

namespace server.Services
{
    public interface IService
    {
        Task<List<ServiceDTO.ServiceDetail>> GetAllServices();
         Task<ServiceDTO.ServiceDetail> GetServiceByName(string serviceName);
        // Task<Service> PostService(Service service);
    }
}