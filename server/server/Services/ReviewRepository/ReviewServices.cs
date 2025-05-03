using AutoMapper;
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
    }
}