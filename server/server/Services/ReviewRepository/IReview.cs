using server.DTO;
using server.Models;

namespace server.Services.RatingRepository
{
    public interface IReview
    {
        Task<Review> AddReview(ReviewForm reviewForm);
        Task<DoctorReviewDetail> AddDoctorReview(int reviewId, DoctorRatings doctorReview);
        Task<ServiceReviewDetail> AddServiceReview(int reviewId, ServiceRatings serviceReview);
        Task<List<ServiceReview>> GetServiceReviews(string serviceName);
        Task<ReviewDTO> CheckExistReview(int recordId);
    }
}
