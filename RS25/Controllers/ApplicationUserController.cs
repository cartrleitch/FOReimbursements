using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using RS25.Data;
using RS25.Models;

namespace RS25.Controllers
{
       [ApiController]
    [Route("api/[controller]")]
    public class ApplicationUserController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        public ApplicationUserController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        // GET: api/applicationuser
        [HttpGet(Name = "GetApplicationUsers")]
        [Authorize]
        public async Task<IActionResult> GetApplicationUsers()
        {
            var users = await _context.Users.ToListAsync();
            var result = new List<object>();
            
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    id = user.Id,
                    email = user.EmailAddress,
                    role = roles.FirstOrDefault() ?? "",
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    phoneNumber = user.PhoneNumber,
                    address = user.Address,
                    city = user.City,
                    state = user.State,
                    zipCode = user.ZipCode
                });
            }

            return Ok(result);
        }
        // GET: api/applicationuser/{id}
        [HttpGet("{id}", Name = "GetApplicationUserById")]
        [Authorize]
        public async Task<IActionResult> GetApplicationUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid User ID");
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        // POST: api/applicationuser
        [HttpPost(Name = "CreateApplicationUser")]
        [Authorize]
        public async Task<IActionResult> CreateApplicationUser([FromBody] ApplicationUser user)
        {
            if (user == null)
            {
                return BadRequest("User data is null");
            }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetApplicationUserById", new { id = user.Id }, user);
        }
        // PUT: api/applicationuser/{id}
        [HttpPut("{id}", Name = "UpdateApplicationUser")]
        [Authorize]
        public async Task<IActionResult> UpdateApplicationUser([FromBody] ApplicationUser user)
        {
            Console.WriteLine($"<---- Updating user with ID: {user.Id}");
            Console.WriteLine($"<---- User data: {user}");
            Console.WriteLine($"<---- User data: {user.FirstName}");
            if (user == null)
            {
                return BadRequest("User data is null");
            }
            Console.WriteLine($"<---- Updating user with ID: {user.Id}");
            Console.WriteLine($"<---- User data: {user}");
            var existingUser = await _context.Users.FindAsync(user.Id);
            Console.WriteLine($"<---- Existing user: {existingUser}");
            if (existingUser == null)
            {
                return NotFound("User not found");
            }
            if (!string.IsNullOrEmpty(user.FirstName))
            {
                existingUser.FirstName = user.FirstName;
                _context.Entry(existingUser).Property(u => u.FirstName).IsModified = true;
            }
            if (!string.IsNullOrEmpty(user.LastName))
            {
                existingUser.LastName = user.LastName;
                _context.Entry(existingUser).Property(u => u.LastName).IsModified = true;
            }
            if (!string.IsNullOrEmpty(user.EmailAddress))
            {
                existingUser.EmailAddress = user.EmailAddress;
                _context.Entry(existingUser).Property(u => u.EmailAddress).IsModified = true;
            }
            if (!string.IsNullOrEmpty(user.PhoneNumber))
            {
                existingUser.PhoneNumber = user.PhoneNumber;
                _context.Entry(existingUser).Property(u => u.PhoneNumber).IsModified = true;
            }
            if (!string.IsNullOrEmpty(user.Address))
            {
                existingUser.Address = user.Address;
                _context.Entry(existingUser).Property(u => u.Address).IsModified = true;
            }
            if (!string.IsNullOrEmpty(user.City))
            {
                existingUser.City = user.City;
                _context.Entry(existingUser).Property(u => u.City).IsModified = true;
            }
            if (!string.IsNullOrEmpty(user.State))
            {
                existingUser.State = user.State;
                _context.Entry(existingUser).Property(u => u.State).IsModified = true;
            }
            if (!string.IsNullOrEmpty(user.ZipCode))
            {
                existingUser.ZipCode = user.ZipCode;
                _context.Entry(existingUser).Property(u => u.ZipCode).IsModified = true;
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            return Ok(existingUser);
        }
        // DELETE: api/applicationuser/{id}
        [HttpDelete("{id}", Name = "DeleteApplicationUserById")]
        [Authorize]
        public async Task<IActionResult> DeleteApplicationUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Invalid User ID");
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description).ToList());
            }

            return Ok("User deleted successfully");
        }
    }
}