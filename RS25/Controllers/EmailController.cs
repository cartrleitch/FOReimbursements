using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS25.Data;
using RS25.Models;
using System.Net;
using System.Net.Mail;

namespace RS25.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IConfiguration _config;

        public EmailController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("send", Name = "SendEmail")]
        public async Task<IActionResult> SendEmail([FromBody] Email email)
        {
            var smtpSettings = _config.GetSection("SmtpSettings");
            if (email == null || string.IsNullOrEmpty(email.Type) || string.IsNullOrEmpty(email.Content))
            {
                return BadRequest("Invalid email data");
            }
            if (string.IsNullOrEmpty(smtpSettings["Host"]) || 
                string.IsNullOrEmpty(smtpSettings["Port"]) || 
                string.IsNullOrEmpty(smtpSettings["Username"]) || 
                string.IsNullOrEmpty(smtpSettings["Password"]) || 
                string.IsNullOrEmpty(smtpSettings["To"]) ||
                string.IsNullOrEmpty(smtpSettings["EnableSsl"]))
            {
                return BadRequest("SMTP settings are not configured properly");
            }
            var host = smtpSettings["Host"]!;
            var port = smtpSettings["Port"]!;
            var username = smtpSettings["Username"]!;
            var password = smtpSettings["Password"]!;
            var to = smtpSettings["To"]!;
            var enableSsl = smtpSettings["EnableSsl"]!;

            using var client = new SmtpClient(host, int.Parse(port))
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = bool.Parse(enableSsl)
            };

            var mail = new MailMessage             {
                From = new MailAddress(username),
                Subject = email.Type,
                Body = email.Content,
                IsBodyHtml = false
            };
            mail.To.Add(new MailAddress(to));
            await client.SendMailAsync(mail);
            return Ok("Email sent successfully");
        }
    }
}