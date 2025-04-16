using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.DTO;
using server.Middleware;
using server.Models;
using server.Services;
using Server.DTO;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Clinic_Management.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly IMapper _mapper;

        public MedicinesController(ClinicManagementContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/medicines
        [HttpGet]
        public async Task<List<MedicineDTO.MedicineBasic>> GetMedicines()
        {
            var medicines = await _context.Medicines
                .ToListAsync();
            var medicineDTOs = _mapper.Map<List<MedicineDTO.MedicineBasic>>(medicines);
            return medicineDTOs;
        }
    }
}