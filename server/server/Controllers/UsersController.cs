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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ClinicManagementContext _context;
        private readonly IUser _userService;

        public UsersController(ClinicManagementContext context, IUser userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult> GetUserById()
        {
            var userId = HttpContext.Items["UserId"];
            var role = HttpContext.Items["role"];
            int parsedUserId = Convert.ToInt32(userId.ToString());

            var user = await _userService.GetUserById(parsedUserId, role.ToString());

            return Ok(user);
        }
    }
}