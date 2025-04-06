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
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly IPatient _patientService;

        public PatientsController(ClinicManagementContext context, IPatient patientService)
        {
            _context = context;
            _patientService = patientService;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<List<PatientDTO.PatientBasic>>> GetAllPatients()
        {
            return await _patientService.GetAllPatients();
        }

        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDTO.PatientDetail>> GetPatientById(int id)
        {
            var patient = await _patientService.GetPatientById(id);

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        // GET: api/Patients/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<PatientDTO.PatientDetail>> GetPatientByUserId(int userId)
        {
            var patient = await _patientService.GetPatientByUserId(userId);

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        // GET: api/Patients/username/johndoe
        [HttpGet("username/{userName}")]
        public async Task<ActionResult<PatientDTO.PatientDetail>> GetPatientByUserName(string userName)
        {
            Console.WriteLine(userName);
            if (string.IsNullOrEmpty(userName))
            {
                throw new ErrorHandlingException(400, "UserName is required");
            }

            var patient = await _patientService.GetPatientByUserName(userName);

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        // GET: api/Patients/search?keyword=abc
        [HttpGet("search")]
        public async Task<ActionResult<List<PatientDTO.PatientBasic>>> SearchPatients([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest("Keyword is required");

            var patients = await _patientService.SearchPatients(keyword);

            return Ok(patients);
        }

        // POST: api/Patients
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<PatientDTO.PatientDetail>> CreatePatient(PatientDTO.PatientDetail patientDTO)
        {
            try
            {
                var createdPatient = await _patientService.CreatePatient(patientDTO);
                return CreatedAtAction(nameof(GetPatientById), new { id = createdPatient.PatientId }, createdPatient);
            }
            catch (Exception ex)
            {
                throw new ErrorHandlingException(500, ex.Message);
            }
        }

        // PUT: api/Patients/5
        [Authorize(Roles = "admin,patient")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, PatientDTO.PatientDetail patientDTO)
        {
            try
            {
                var updatedPatient = await _patientService.UpdatePatient(id, patientDTO);
                
                if (updatedPatient == null)
                {
                    return NotFound();
                }
                
                return Ok(updatedPatient);
            }
            catch (Exception ex)
            {
                throw new ErrorHandlingException(500, ex.Message);
            }
        }

        // DELETE: api/Patients/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            try
            {
                var result = await _patientService.DeletePatient(id);
                
                if (!result)
                {
                    return NotFound();
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                throw new ErrorHandlingException(500, ex.Message);
            }
        }
    }
}