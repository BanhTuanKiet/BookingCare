using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Authorize(Roles = "patient")]
    [Route("api/[controller]")]
    [ApiController]
    public class ContactMessagesController : ControllerBase
    {
        private readonly IContact _contactService;
        private readonly IPatient _patientServices;
        public ContactMessagesController(IContact contactService, IPatient patientServices)
        {
            _contactService = contactService;
            _patientServices = patientServices;
        }

        [HttpPost("{message}")]
        public async Task<ActionResult> SendMessage(string message)
        {
            var userId = HttpContext.Items["UserId"];
            var parseUserId = Convert.ToInt32(userId.ToString());

            var patient = await _patientServices.GetPatientByUserId(parseUserId) ?? throw new ErrorHandlingException(404, "Patient not found");

            if (message == null) throw new ErrorHandlingException(400, "Vui lòng nhập nội dung!");

            ContactMessages contactMessages = new ContactMessages
            {
                PatientId = patient.PatientId,
                Messages = message,
                CreatedAt = DateTime.Now
            };

            ContactMessages contact = await _contactService.SendMessage(contactMessages) ?? throw new ErrorHandlingException("Gửi thất bại!");

            return Ok(new { message = "Gửi thành công" });
        }
    }
}