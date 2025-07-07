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

        // PUT: api/reimbursement/{id}
        [HttpPut("{id}", Name = "UpdateReimbursement")]
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
            currReim.Vendor = Reimbursement.Vendor;
            currReim.VendorAddress = Reimbursement.VendorAddress;
            currReim.VendorWebsite = Reimbursement.VendorWebsite;
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

        // POST: api/reimbursement/upload
        [HttpPost("upload/{id}", Name = "UploadFile")]
        public async Task<IActionResult> UploadFiles(int id, [FromForm] List<IFormFile> files)
        {
            if (files.Count == 0 || files == null)
            {
                return BadRequest("No files uploaded");
            } 

            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists("Uploads"))
            {
                Directory.CreateDirectory("Uploads");
            }
            var filePaths = new List<string>();
            foreach (var file in files) {
                var fileNameWithGuid = $"{Guid.NewGuid()}_{file.FileName}";
                using (var stream = new FileStream(Path.Combine("Uploads", $"{fileNameWithGuid}"), FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                    filePaths.Add(file.FileName);
                }
                var fileReceiptMetaData = new Receipt
                {
                    FileName = fileNameWithGuid,
                    FilePath = Path.Combine(uploadDir, fileNameWithGuid),
                    UploadDate = DateTime.Now.ToUniversalTime(),
                    ReimId = id
                };
                _context.Receipt.Add(fileReceiptMetaData);
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Files uploaded successfully", FilePaths = filePaths });
        }
    }
}