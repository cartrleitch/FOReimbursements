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

            // If account with the same email already exists, return an error, unless it was previously deleted, in which case, it is restored
            var accountExists = await _userManager.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.EmailAddress == user.EmailAddress);
            Console.WriteLine($"<------------ Account exists: {accountExists} <------------");
            if (accountExists != null)
            {
                if (accountExists.IsDeleted)
                {
                    accountExists.IsDeleted = false;
                    accountExists.DeletedAt = null;
                    var updateResult = await _userManager.UpdateAsync(accountExists);
                    if (!updateResult.Succeeded)
                    {
                        return BadRequest(updateResult.Errors.Select(e => e.Description).ToList());
                    }
                    return Ok("User account restored successfully");
                }
                else
                {
                    return BadRequest("User with this email already exists");
                }
            }

            // Creates user with any data client might send for it (automatically sets ID, etc., because of model)
            var newUser = new ApplicationUser
            {
                UserName = user.EmailAddress,
                Email = user.EmailAddress,
                EmailAddress = user.EmailAddress,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                City = user.City,
                State = user.State,
                ZipCode = user.ZipCode
            };

            var createResult = await _userManager.CreateAsync(newUser);
            if (!createResult.Succeeded)
            {
                return BadRequest(createResult.Errors.Select(e => e.Description).ToList());
            }

            var roleResult = await _userManager.AddToRoleAsync(newUser, "User");
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(newUser);
                return BadRequest(roleResult.Errors.Select(e => e.Description).ToList());
            }
            
            return CreatedAtRoute("GetApplicationUserById", new { id = newUser.Id }, newUser);
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

            user.IsDeleted = true;
            user.DeletedAt = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return Ok("User deleted successfully");
        }
        // DELETE: api/applicationuser/{id}
        [HttpDelete("/fulldelete/{id}", Name = "FullDeleteApplicationUserById")]
        [Authorize]
        public async Task<IActionResult> FullDeleteApplicationUserById(string id)
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