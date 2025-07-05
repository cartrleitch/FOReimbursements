using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS25.Data;
using RS25.Models;

namespace RS25.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PurchaseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/purchase
        [HttpGet(Name = "GetPurchase")]
        public async Task<IActionResult> GetPurchases()
        {
            var purchases = await _context.Purchase.ToListAsync();

            return Ok(purchases);
        }

        // POST: api/purchase
        [HttpPost(Name = "CreatePurchase")]
        public async Task<IActionResult> CreatePurchase([FromBody] Purchase purchase)
        {
            if (purchase == null)
            {
                return BadRequest("Purchase cannot be null");
            }

            _context.Purchase.Add(purchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPurchases), new { id = purchase.Id }, purchase);
        }

        // PUT: api/purchase/{id}
        [HttpPut("{id}", Name = "UpdatePurchase")]
        public async Task<IActionResult> UpdatePurchase(int id, [FromBody] Purchase purchase)
        {
            if (purchase == null || id != purchase.Id)
            {
                return BadRequest("Purchase data is invalid");
            }

            var currPur = await _context.Purchase.FindAsync(id);

            if (currPur == null)
            {
                return NotFound("Purchase not found");
            }
            currPur.Account = purchase.Account;
            currPur.Description = purchase.Description;
            currPur.Amount = purchase.Amount;
            currPur.PurchaseDate = purchase.PurchaseDate;

            await _context.SaveChangesAsync();

            return Ok(id);
        }

        // DELETE: api/purchase/{id}
        [HttpDelete("{id}", Name = "DeletePurchase")]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid Purchase ID");
            }

            var pur = await _context.Purchase.FindAsync(id);

            if (pur == null)
            {
                return NotFound("Purchase not found");
            }

            _context.Purchase.Remove(pur);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}