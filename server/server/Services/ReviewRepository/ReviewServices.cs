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

        public async Task<List<DepartmentRatingDTO>> GetDepartmentRatings()
        {
            var doctorReviewDetails = await _context.DoctorReviewDetails
                .Include(d => d.Review.MedicalRecord.Appointment.Doctor.Specialty)
                .Where(d => d.Review.MedicalRecord.Appointment.Doctor.Specialty != null)
                .ToListAsync();

            foreach (var item in doctorReviewDetails) 
                Console.WriteLine ($"Tên khoa: { item.Review.MedicalRecord.Appointment.Doctor.Specialty.Name}");
            var departmentGroups = doctorReviewDetails
                .GroupBy(d => new
                {
                    SpecialtyId = d.Review.MedicalRecord.Appointment.Doctor.Specialty.SpecialtyId,
                    SpecialtyName = d.Review.MedicalRecord.Appointment.Doctor.Specialty.Name
                })
                .Select(g => new DepartmentRatingDTO
                {
                    DepartmentId = g.Key.SpecialtyId,
                    DepartmentName = g.Key.SpecialtyName,
                    AvgKnowledge = Math.Round(g.Average(r => r.Knowledge), 2),
                    AvgAttitude = Math.Round(g.Average(r => r.Attitude), 2),
                    AvgDedication = Math.Round(g.Average(r => r.Dedication), 2),
                    AvgCommunicationSkill = Math.Round(g.Average(r => r.CommunicationSkill), 2)
                })
                .OrderByDescending(d => d.OverallAverage)
                .ToList();

            return departmentGroups;
        }


    }
}