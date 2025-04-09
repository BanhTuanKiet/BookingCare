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
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.FullName))
                .ForMember(dest => dest.DoctorImage, m => m.MapFrom(source =>
                    source.DoctorImage != null
                        ? $"data:image/png;base64,{Convert.ToBase64String(source.DoctorImage)}"
                        : null
                ));

            CreateMap<Doctor, DoctorDTO.DoctorDetail>()
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.FullName))
                .ForMember(dest => dest.Email, m => m.MapFrom(source => source.User.Email))
                .ForMember(dest => dest.DoctorImage, m => m.MapFrom(source =>
                    source.DoctorImage != null
                        ? $"data:image/png;base64,{Convert.ToBase64String(source.DoctorImage)}"
                        : null
                ));

            CreateMap<Service, ServiceDTO.ServiceDetail>();

            CreateMap<Patient, PatientDTO.PatientBasic>()
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.FullName));

            CreateMap<Patient, PatientDTO.PatientDetail>()
                .ForMember(dest => dest.UserName, m => m.MapFrom(source => source.User.FullName))
                .ForMember(dest => dest.Email, m => m.MapFrom(source => source.User.Email))
                .ForMember(dest => dest.PhoneNumber, m => m.MapFrom(source => source.User.PhoneNumber));

            CreateMap<Appointment, AppointmentDTO.AppointmentDetail>()
                .ForMember(dest => dest.PatientName, m => m.MapFrom(source => source.Patient.User.FullName))
                .ForMember(dest => dest.DoctorName, m => m.MapFrom(source => source.Doctor.User.FullName))
                .ForMember(dest => dest.ServiceName, m => m.MapFrom(source => source.Service.ServiceName))
                .ForMember(dest => dest.AppointmentDate, m => m.MapFrom(source => 
                    source.AppointmentDate.HasValue ? source.AppointmentDate.Value.ToString("yyyy-MM-dd HH:mm:ss") : null))
                .ForMember(dest => dest.Status, m => m.MapFrom(source => source.Status));
        }
    }
}
