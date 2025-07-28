using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RS25.Data;
using RS25.Models;

namespace RS25.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorController : ControllerBase
    {
        private readonly AppDbContext _context;
        public VendorController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/vendor
        [HttpGet(Name = "GetVendor")]
        [Authorize]
        public async Task<IActionResult> GetVendors()
        {
            var vendors = await _context.Vendor.ToListAsync();
            return Ok(vendors);
        }
        // POST: api/vendor
        [HttpPost(Name = "CreateVendor")]
        [Authorize]
        public async Task<IActionResult> CreateVendor([FromBody] Vendor vendor)
        {
            if (vendor == null)
            {
                return BadRequest("Vendor cannot be null");
            }
            _context.Vendor.Add(vendor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVendors), new { id = vendor.Id }, vendor);
        }
        // DELETE: api/vendor/{id}
        [HttpDelete("{id}", Name = "DeleteVendor")]
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> DeleteVendor(int id)
        {
            var vendor = await _context.Vendor.FindAsync(id);
            if (vendor == null)
            {
                return NotFound("Vendor not found");
            }
            _context.Vendor.Remove(vendor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}