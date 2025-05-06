using AutoMapper;
using Microsoft.AspNetCore.Razor.Language;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Models;

namespace server.Services.RatingRepository
{
    public class ReviewServices : IReview
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public ReviewServices(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ReviewDTO> CheckExistReview(int recordId)
        {
            var review = await _context.Reviews
                .Include(review => review.DoctorReviewDetail)
                .Include(review => review.ServiceReviewDetail)
                .FirstOrDefaultAsync(review => review.PrescriptionId == recordId);

            var reviewDTO = _mapper.Map<ReviewDTO>(review);

            return reviewDTO;
        }
        public async Task<Review> AddReview(ReviewForm reviewForm)
        {
            Review review = new Review
            {
                PrescriptionId = reviewForm.RecordId,
                OverallRating = reviewForm.OverallRating,
                Comment = reviewForm.Comment,
                CreatedAt = DateTime.Now
            };
                    
            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<DoctorReviewDetail> AddDoctorReview(int reviewId, DoctorRatings doctorReview)
        {
            DoctorReviewDetail doctorReviewDetail = new DoctorReviewDetail
            {
                ReviewId = reviewId,
                Knowledge = doctorReview.Knowledge,
                Attitude = doctorReview.Attitude,
                Dedication = doctorReview.Dedication,
                CommunicationSkill = doctorReview.CommunicationSkill
            };

            await _context.DoctorReviewDetails.AddAsync(doctorReviewDetail);
            await _context.SaveChangesAsync();
            return doctorReviewDetail;
        }

        public async Task<ServiceReviewDetail> AddServiceReview(int reviewId, ServiceRatings serviceReview)
        {
            ServiceReviewDetail serviceReviewDetail = new ServiceReviewDetail
            {
                ReviewId = reviewId,
                Effectiveness = serviceReview.Effectiveness,
                Price = serviceReview.Price,
                ServiceSpeed = serviceReview.ServiceSpeed,
                Convenience = serviceReview.Convenience
            };

            await _context.ServiceReviewDetails.AddAsync(serviceReviewDetail);
            await _context.SaveChangesAsync();
            return serviceReviewDetail;
        }

        public async Task<List<ServiceReview>> GetServiceReviews(int serviceId)
        {
            var serviceReviews = await _context.Reviews
                .Include(review => review.MedicalRecord.Appointment.Patient.User)
                .Include(review => review.MedicalRecord.Appointment.Service)
                .Where(r => r.MedicalRecord.Appointment.Service.ServiceId == serviceId)
                .Take(3)
                .ToListAsync();

            var serviceReviewDTOs = _mapper.Map<List<ServiceReview>>(serviceReviews);

            return serviceReviewDTOs;
        }

        public async Task<List<ServiceReview>> GetDoctorReviews(int doctorId)
        {
            var serviceReviews = await _context.Reviews
                .Include(review => review.MedicalRecord.Appointment.Patient.User)
                .Include(review => review.MedicalRecord.Appointment.Doctor)
                .Where(r => r.MedicalRecord.Appointment.Doctor.DoctorId == doctorId)
                .Take(3)
                .ToListAsync();

            var serviceReviewDTOs = _mapper.Map<List<ServiceReview>>(serviceReviews);

            return serviceReviewDTOs;
        }

        public async Task<List<DepartmentRatingsDTO>> GetTopDoctorsByDepartment()
        {
            var doctorReviewDetails = await _context.DoctorReviewDetails
                .Include(d => d.Review.MedicalRecord.Appointment.Doctor.Specialty)
                .Include(d => d.Review.MedicalRecord.Appointment.Doctor.User)
                .Include(d => d.Review.MedicalRecord.Appointment.Doctor)
                .Where(d => d.Review.MedicalRecord.Appointment.Doctor.Specialty != null)
                .ToListAsync();

            // Tính điểm trung bình cho từng bác sĩ
            var allDoctors = doctorReviewDetails
                .GroupBy(d => d.Review.MedicalRecord.Appointment.Doctor.DoctorId)
                .Select(doc =>
                {
                    var doctor = doc.First().Review.MedicalRecord.Appointment.Doctor;
                    var user = doctor.User;
                    var doctorImage = doctor.DoctorImage != null ? Convert.ToBase64String(doctor.DoctorImage) : null;

                    return new DoctorReviewDetails
                    {
                        DoctorId = doc.Key,
                        UserName = user?.FullName,
                        Position = doctor.Position,
                        SpecialtyId = doctor.SpecialtyId,
                        ExperienceYears = doctor.ExperienceYears,
                        DoctorImage = doctorImage,
                        Degree = doctor.Degree,
                        AvgKnowledge = doc.Average(r => r.Knowledge),
                        AvgAttitude = doc.Average(r => r.Attitude),
                        AvgDedication = doc.Average(r => r.Dedication),
                        AvgCommunicationSkill = doc.Average(r => r.CommunicationSkill)
                    };
                })
                .Where(d => d.SpecialtyId != null)
                .ToList();

            // Nhóm theo SpecialtyId và lấy bác sĩ có điểm cao nhất trong từng khoa
            var departments = allDoctors
                .GroupBy(d => d.SpecialtyId)
                .Select(group =>
                {
                    double maxAvg = group.Max(d => d.OverallAverage);

                    var topDoctors = group
                        .Where(d => d.OverallAverage == maxAvg)
                        .ToList();

                    var departmentName = _context.Specialties
                        .Where(s => s.SpecialtyId == group.Key)
                        .Select(s => s.Name)
                        .FirstOrDefault() ?? "Không rõ khoa";

                    return new DepartmentRatingsDTO
                    {
                        DepartmentName = departmentName,
                        TopDoctors = topDoctors
                    };
                })
                .ToList();

            return departments;
        }
    }
}