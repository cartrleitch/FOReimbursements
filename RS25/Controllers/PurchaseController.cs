using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using RS25.Data;
using RS25.Models;
using OpenAI.Chat;
using System.Text.Json;
using System.ClientModel;

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
        [Authorize]
        public async Task<IActionResult> GetPurchases()
        {
            var purchases = await _context.Purchase.ToListAsync();

            return Ok(purchases);
        }
        // GET: api/purchase/{id}
        [HttpGet("{reimId}", Name = "GetPurchaseByReimId")]
        [Authorize]
        public async Task<IActionResult> GetPurchaseByReimId(int reimId)
        {
            if (reimId <= 0)
            {
                return BadRequest("Invalid Purchase ID");
            }
            var purchases = await _context.Purchase
                .Where(p => p.ReimId == reimId)
                .Join(
                _context.Receipt,
                purchase => purchase.Id,
                receipt => receipt.PurId,
                (purchase, receipt) => new
                {
                    purchase.Id,
                    purchase.Account,
                    purchase.Description,
                    purchase.Amount,
                    purchase.PurchaseDate,
                    purchase.ReimId,
                    receipt.FileName,
                    receipt.FilePath
                }
                ).ToListAsync();
            if (purchases == null)
            {
                return NotFound("Purchase not found");
            }
            return Ok(purchases);
        }

        // POST: api/purchase
        [HttpPost(Name = "CreatePurchase")]
        [Authorize]
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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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

        // POST: api/purchase/upload
        [HttpPost("upload/{id}", Name = "UploadFile")]
        [Authorize]
        public async Task<IActionResult> UploadFiles(int id, IFormFile file)
        {
            if (file == null)
            {
                return BadRequest("No files uploaded");
            }

            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists("Uploads"))
            {
                Directory.CreateDirectory("Uploads");
            }

            var fileNameWithGuid = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadDir, fileNameWithGuid);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileReceiptMetaData = new Receipt

            {
                FileName = fileNameWithGuid,
                FilePath = Path.Combine(uploadDir, fileNameWithGuid),
                UploadDate = DateTime.Now.ToUniversalTime(),
                PurId = id
            };
            _context.Receipt.Add(fileReceiptMetaData);

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Files uploaded successfully", FilePath = filePath });
        }

        // POST: api/purchase/summary
        [HttpPost("summary", Name = "SummarizeReceipt")]
        [Authorize]
        public async Task<IActionResult> SummarizeReceipt([FromBody] string fileBase64)
        {
            Console.WriteLine("<------ Received file data for summarization" + fileBase64);
            if (fileBase64 == null)
                {
                return BadRequest("File data is null");
            }

            ChatClient client = new(
                model: "gpt-4.1-mini",
                apiKey: Environment.GetEnvironmentVariable("OPENAI_API_KEY")
            );

            string promptString = $$"""
                {
                    "model": "gpt-4.1-mini",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Read this receipt and return a JSON with date, descriptionOfPurchase, and total. descriptionOfPurchase should be a 1-50 word summary of the purchase. Date should be in ISO 8601 format YYYY-MM-DD. If a piece of information is not available, set the value to null. Output text should only be a JSON object no matter what; it must be able to be parsed to a JSON object. DO NOT include a prefix of ```json or anything"
                                }
                            ]
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": { 
                                    "url": "{{fileBase64}}",
                                    "detail": "auto" 
                                    }
                                }
                            ]
                        }
                    ]
                }
                """;

            try
            {
                BinaryData input = BinaryData.FromString(promptString);

                using BinaryContent content = BinaryContent.Create(input);

                ClientResult result = await client.CompleteChatAsync(content);

                BinaryData output = result.GetRawResponse().Content;

                using JsonDocument outputJson = JsonDocument.Parse(output.ToString());

                string outputString = outputJson.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString()!;
                Console.WriteLine("<------ Final JSON Result " + outputString);

                return Ok(outputString);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error during summarization: " + ex.Message);
                return StatusCode(500, "Internal server error during summarization.");
            }
        }
    }
}