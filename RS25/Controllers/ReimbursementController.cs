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
        public async Task<IActionResult> GetReimbursements()
        {
            var reimbursements = await _context.Reimbursement.ToListAsync();

            return Ok(reimbursements);
        }

        // POST: api/reimbursement
        [HttpPost(Name = "CreateReimbursement")]
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
    }
}