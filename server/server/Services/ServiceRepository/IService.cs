using server.Models;
using server.DTO;

namespace server.Services
{
    public interface IService
    {
        Task<List<ServiceDTO.ServiceDetail>> GetAllServices();
        Task<ServiceDTO.ServiceDetail> GetServiceByName(string serviceName);
        Task<List<ServiceDTO.ServiceDetail>> GetServiceBySpecialty(string specialtyName);
        // Task<Service> PostService(Service service);
    }
}