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
        }
    }
}
