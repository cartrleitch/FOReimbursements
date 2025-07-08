using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS25.Data;
using RS25.Models;

namespace RS25.Controllers {

        [Route("api/[controller]")]
        [ApiController]
        public class ReceiptController : ControllerBase
        {
            private readonly AppDbContext _context;

            public ReceiptController(AppDbContext context)
            {
                _context = context;
            }
        // GET: api/receipt
        [HttpGet(Name = "GetReceipt")]
            public async Task<IActionResult> GetReceipts()
            {
                var receipts = await _context.Receipt.ToListAsync();

                return Ok(receipts);
            }

        // GET: api/receipt/{id}
        [HttpGet("{purId}", Name = "GetReceiptByPurId")]
        public async Task<IActionResult> GetReceiptByPurId(int purId)
        {
            if (purId <= 0)
            {
                return BadRequest("Invalid Purchase ID");
            }
            var receipts = await _context.Receipt.Where(p => p.PurId == purId).ToListAsync();
            if (receipts == null)
            {
                return NotFound("Purchase not found");
            }
            return Ok(receipts);
        }

        // GET: api/receipt/download/{fileName}
        [HttpGet("download/{fileName}", Name = "GetFileByName")]
        public IActionResult GetFileByName(string fileName)
        {
            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            var filePath = Path.Combine(uploadDir, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found");
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var contentType =  "application/octet-stream";

            return File(fileStream, contentType, fileName);
        }

        // POST api/receipt
        [HttpPost(Name = "CreateReceipt")]
        public async Task<IActionResult> CreateReceipt([FromBody] Receipt receipt)
        {
            if (receipt == null)
            {
                return BadRequest("Purchase cannot be null");
            }

            _context.Receipt.Add(receipt);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReceipts), new { id = receipt.Id }, receipt);
        }

        // PUT api/receipt
        [HttpPut("{id}")]
            public void Put(int id, [FromBody] string value)
            {
            }

        [HttpDelete("{id}", Name = "DeleteReceipt")]
        public async Task<IActionResult> DeleteReceipt(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid Purchase ID");
            }

            var rec = await _context.Receipt.FindAsync(id);

            if (rec == null)
            {
                return NotFound("Receipt not found");
            }
            if (!string.IsNullOrEmpty(rec.FilePath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), rec.FilePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Receipt.Remove(rec);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

