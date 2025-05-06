using server.DTO;
using server.Models;

namespace server.Services.RatingRepository
{
    public interface IReview
    {
        Task<Review> AddReview(ReviewForm reviewForm);
        Task<DoctorReviewDetail> AddDoctorReview(int reviewId, DoctorRatings doctorReview);
        Task<ServiceReviewDetail> AddServiceReview(int reviewId, ServiceRatings serviceReview);
        Task<List<ServiceReview>> GetServiceReviews(int serviceId);
        Task<List<ServiceReview>> GetDoctorReviews(int doctorId);
        Task<ReviewDTO> CheckExistReview(int recordId);
        Task<List<DepartmentRatingDTO>> GetDepartmentRatings();
    }
}
