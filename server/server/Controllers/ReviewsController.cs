using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Services;
using server.Services.RatingRepository;

namespace server.Controllers
{
    // [Authorize(Roles = "paient")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : Controller
    {
        private readonly ClinicManagementContext _context;
        public ReviewsController(IReview reviewService, ClinicManagementContext context)
        {
            _reviewService = reviewService;
            _context = context;
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
            if (type == "service")
            {
                reviews = await _reviewService.GetServiceReviews(id);
            }
            else 
            {
                reviews = await _reviewService.GetDoctorReviews(id);
            }
            
            return Ok(reviews);
        }
        
        [HttpGet("doctors-rating")]
        public async Task<ActionResult<List<DepartmentRatingsDTO>>> GetTopDoctorsByStar()
        {
            var ratings = await _reviewService.GetTopDoctorsByDepartment();
            return Ok(ratings);
        
        [HttpGet("detail/{filter}/{type}/{id}")]
        public async Task<ActionResult> GetReviewsDetail(string filter, string type, int id)
        {
            object reviews;
            if (type == "service")
            {
                reviews = await _reviewService.GetDoctorReviewsDetail(filter, id);
            }
            else
            {
                reviews = await _reviewService.GetDoctorReviewsDetail(filter, id);
            }

            return Ok(reviews);
        }

        [HttpGet("doctors/{specialtyName}")]
        public async Task<ActionResult> GetDoctorsReviewBySpecialty(string specialtyName)
        {
            var reviews = await _context.Reviews
                .Include(review => review.MedicalRecord)
                .Include(review => review.MedicalRecord.Appointment)
                .Include(review => review.MedicalRecord.Appointment.Doctor)
                .Include(review => review.MedicalRecord.Appointment.Doctor.User)
                .Include(review => review.MedicalRecord.Appointment.Doctor.Specialty)
                .Where(review => review.MedicalRecord.Appointment.Doctor.Specialty.Name == specialtyName)
                .GroupBy(review => review.MedicalRecord.Appointment.Doctor.DoctorId)
                .Select(group => new DoctorReviewBasic
                {
                    DoctorId = Convert.ToInt32(group.Key),
                    ReviewCount = group.Count(),
                    AvgScore = group.Average(r => r.OverallRating)
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("rating/{doctorId}")]
        public async Task<ActionResult> GetRatingReviews(int doctorId)
        {
            var review = _reviewService.GetRatingReviews(doctorId);
            
            return Ok(review.Result);
        }
    }
}
