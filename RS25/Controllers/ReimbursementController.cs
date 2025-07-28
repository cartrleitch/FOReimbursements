using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS25.Data;
using RS25.Models;

namespace RS25.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReimbursementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReimbursementController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/reimbursement
        [HttpGet(Name = "GetReimbursement")]
        [Authorize]
        public async Task<IActionResult> GetReimbursements()
        {
            var reimbursements = await _context.Reimbursement.Select(r => new
            {
                r.Id,
                r.TotalAmount,
                r.DateSubmitted,
                r.PaymentMethod,
                r.Status,
                r.DateApproved,
                r.ActionRequested,
                VendorName = _context.Vendor.Where(v => v.Id.ToString() == r.VendorId).Select(v => v.Name).FirstOrDefault(),
                UserName = _context.Users.Where(u => u.Id == r.UserId).Select(u => u.UserName).FirstOrDefault()
            }).ToListAsync();

            return Ok(reimbursements);
        }

        // GET: api/reimbursement/{id}
        // returns all reimbursements for a specific user and includes the
        //vendor name if vendorid is provided and UserName of user
        [HttpGet("{id}", Name = "GetReimbursementByUserId")]
        [Authorize]
        public async Task<IActionResult> GetReimbursementByUserId(string id)
        {
            if (id == "")
            {
                return BadRequest("Invalid User ID");
            }
            var reimbursements = await _context.Reimbursement
                .Where(r => r.UserId == id)
                .Select(r => new 
                {
                    r.Id,
                    r.TotalAmount,
                    r.DateSubmitted,
                    r.PaymentMethod,
                    r.Status,
                    r.DateApproved,
                    r.ActionRequested,
                    VendorName = _context.Vendor.Where(v => v.Id.ToString() == r.VendorId).Select(v => v.Name).FirstOrDefault(),
                    UserName = _context.Users.Where(u => u.Id == r.UserId).Select(u => u.UserName).FirstOrDefault()
                })
                .ToListAsync();
            if (reimbursements == null || !reimbursements.Any())
            {
                return NotFound("No reimbursements found for this user");
            }
            return Ok(reimbursements);
        }

        // POST: api/reimbursement
        [HttpPost(Name = "CreateReimbursement")]
        [Authorize]
        public async Task<IActionResult> CreateReimbursement([FromBody] Reimbursement reimbursement)
        {
            if (reimbursement == null)
            {
                return BadRequest("Reimbursement cannot be null");
            }

            _context.Reimbursement.Add(reimbursement);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReimbursements), new { id = reimbursement.Id }, reimbursement);
        }

        // PUT: api/reimbursement/{id}
        [HttpPut("{id}", Name = "UpdateReimbursement")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> UpdateReimbursement(int id, [FromBody] Reimbursement Reimbursement)
        {
            if (Reimbursement == null || id != Reimbursement.Id)
            {
                return BadRequest("Reimbursement data is invalid");
            }

            var currReim = await _context.Reimbursement.FindAsync(id);

            if (currReim == null)
            {
                return NotFound("Reimbursement not found");
            }
            currReim.TotalAmount = Reimbursement.TotalAmount;
            currReim.DateSubmitted = Reimbursement.DateSubmitted;
            currReim.PaymentMethod = Reimbursement.PaymentMethod;
            currReim.Status = Reimbursement.Status;
            currReim.DateApproved = Reimbursement.DateApproved;

            await _context.SaveChangesAsync();

            return Ok(id);
        }

        // DELETE: api/reimbursement/{id}
        [HttpDelete("{id}", Name = "DeleteReimbursement")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReimbursement(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid Reimbursement ID");
            }

            var reim = await _context.Reimbursement.FindAsync(id);

            if (reim == null)
            {
                return NotFound("Reimbursement not found");
            }

            _context.Reimbursement.Remove(reim);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}