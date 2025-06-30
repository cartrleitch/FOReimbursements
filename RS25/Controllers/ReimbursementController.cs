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
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        /*private readonly ILogger<ReimbursementController> _logger;

        public ReimbursementController(ILogger<ReimbursementController> logger)
        {
            _logger = logger;
        }*/

        [HttpGet(Name = "GetReimbursement")]
        public async Task<IActionResult> GetReimbursements()
        {
            var reimbursements = await _context.Reimbursement.ToListAsync();

            return Ok(reimbursements);
        }
        /*public IEnumerable<Reimbursement> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new Reimbursement
            {
                DateSubmitted = DateTime.Now.AddDays(index),
                Id = Random.Shared.Next(-20, 55),
                TotalAmount = Random.Shared.Next(100, 1000)
            })
            .ToArray();
        }*/
    }
}
