using server.DTO;

namespace server.Services
{
    public interface IMedicine
    {
        Task<List<MedicineDTO.MedicineBasic>> GetAllMedicines();
    }
}