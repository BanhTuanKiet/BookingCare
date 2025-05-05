using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.Middleware;
using server.Services;
using server.Services.RatingRepository;

namespace server.Controllers
{
    // [Authorize(Roles = "paient")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : Controller
    {
        private readonly IReview _reviewService;

        public ReviewsController(IReview reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("exist/{recordId}")]
        public async Task<ActionResult> CheckExistReview(int recordId)
        {
            var review = await _reviewService.CheckExistReview(recordId);

            if (review == null) return Ok(0);

            return Ok(review);
        }

        [HttpPost("")]
        public async Task<ActionResult> Review([FromBody] ReviewForm reviewData)
        {
        //     if (reviewData == null) throw new ErrorHandlingException(400, "ewgwweg");

            var review = await _reviewService.AddReview(reviewData) ?? throw new ErrorHandlingException(400, "qewgweg");
            
            if (reviewData.DoctorRatings?.Knowledge != 0 ||
                reviewData.DoctorRatings.Attitude != 0 ||
                reviewData.DoctorRatings.Dedication != 0 ||
                reviewData.DoctorRatings.CommunicationSkill != 0)
            {
                await _reviewService.AddDoctorReview(review.ReviewId, reviewData.DoctorRatings);
            }

            if (reviewData.ServiceRatings?.Effectiveness != 0 ||
                reviewData.ServiceRatings.Price != 0 ||
                reviewData.ServiceRatings.ServiceSpeed != 0 ||
                reviewData.ServiceRatings.Convenience != 0)
            {
                await _reviewService.AddServiceReview(review.ReviewId, reviewData.ServiceRatings);
            }
            return Ok( new { message = "Đánh giá thành công!" });
        }

        [HttpGet("{type}/{id}")]
        public async Task<ActionResult> GetReviews(string type, int id)
        {
            object reviews;
            if (type == "service") {
                reviews = await _reviewService.GetServiceReviews(id);
            } else {
                reviews = await _reviewService.GetDoctorReviews(id);
            }
            
            return Ok(reviews);
        }

        [HttpGet("department-ratings")]
        public async Task<ActionResult<List<DepartmentRatingDTO>>> GetDepartmentRatings()
        {
            var ratings = await _reviewService.GetDepartmentRatings();
            return Ok(ratings);
        }
    }
}
