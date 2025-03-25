using server.Models;

namespace server.Services
{
    public interface IService
    {
        Task<List<Service>> GetAllServices();
        Task<Service?> GetServiceByName(string serviceName);
        // Task<Service> PostService(Service service);
    }
}