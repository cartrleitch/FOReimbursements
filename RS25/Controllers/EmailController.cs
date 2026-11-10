using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RS25.Models;
using RS25.Services;

namespace RS25.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send", Name = "SendEmail")]
        [Authorize]
        public async Task<IActionResult> SendEmail([FromBody] Email email)
        {
            if (email == null || string.IsNullOrEmpty(email.To) || string.IsNullOrEmpty(email.Subject) || string.IsNullOrEmpty(email.Content))
            {
                return BadRequest("Email, subject, and content are required.");
            }
            try
            {
                await _emailService.SendAsync(email.To, email.Subject, email.Content, isHtml: false, email.AttachmentB64, email.AttachmentFileName);
                return Ok("Email sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}