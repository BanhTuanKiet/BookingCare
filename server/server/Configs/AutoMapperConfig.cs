using AutoMapper;
using server.DTO;
using server.Models;

namespace server.Configs
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<Doctor, DoctorDTO.DoctorBasic>()
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.UserName))
                .ForMember(dest => dest.DoctorImage, m => m.MapFrom(source =>
                    source.DoctorImage != null
                        ? $"data:image/png;base64,{Convert.ToBase64String(source.DoctorImage)}"
                        : null
                ));

            CreateMap<Doctor, DoctorDTO.DoctorDetail>()
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.UserName))
                .ForMember(dest => dest.DoctorImage, m => m.MapFrom(source =>
                    source.DoctorImage != null
                        ? $"data:image/png;base64,{Convert.ToBase64String(source.DoctorImage)}"
                        : null
                ));

            CreateMap<Service, ServiceDTO.ServiceDetail>();
            // New mappings for Patient
            CreateMap<Patient, PatientDTO.PatientBasic>()
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.UserName));

            CreateMap<Patient, PatientDTO.PatientDetail>()
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.UserName))
                .ForMember(dest => dest.Email, m => m.MapFrom(source => source.User.Email))
                .ForMember(dest => dest.PhoneNumber, m => m.MapFrom(source => source.User.PhoneNumber))
                .ForMember(dest => dest.Appointments, m => m.MapFrom(source => source.Appointments));

            // Mapping for creating a new Patient from DTO
            CreateMap<PatientDTO.PatientDetail, Patient>()
                .ForMember(dest => dest.PatientId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Appointments, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceRegistrations, opt => opt.Ignore());

            // If you have an Appointment entity, you'll need this mapping for the PatientDetail DTO
            CreateMap<Appointment, PatientDTO.AppointmentDTO>()
                .ForMember(dest => dest.DoctorName, m => m.MapFrom(source => source.Doctor.User.UserName));
        }
    }
}
