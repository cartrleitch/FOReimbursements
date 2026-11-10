using System.Net;
using System.Net.Mail;

namespace RS25.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body, bool isHtml = false, string? attachmentB64 = null, string? attachmentFileName = null);
    }
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public SmtpEmailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task SendAsync(string to, string subject, string body, bool isHtml = false, string? attachmentB64 = null, string? attachmentFileName = null)
        {
            var smtpSettings = _config.GetSection("SmtpSettings");
            var host = smtpSettings["Host"]!;
            var port = smtpSettings["Port"]!;
            var username = smtpSettings["Username"]!;
            var password = smtpSettings["Password"]!;
            var enableSsl = smtpSettings["EnableSsl"]!;

            if (string.IsNullOrEmpty(host) ||
                string.IsNullOrEmpty(port) ||
                string.IsNullOrEmpty(username) ||
                string.IsNullOrEmpty(password) ||
                string.IsNullOrEmpty(enableSsl))
            {
                throw new InvalidOperationException("SMTP settings are not configured properly");
            }
            
            using var client = new SmtpClient(host, int.Parse(port))
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = bool.Parse(enableSsl)
            };
            using var mail = new MailMessage
            {
                From = new MailAddress(username),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml
            };
            mail.To.Add(new MailAddress(to));
            if (!string.IsNullOrEmpty(attachmentB64) && !string.IsNullOrEmpty(attachmentFileName))
            {
                var attachmentBytes = Convert.FromBase64String(attachmentB64);
                var attachmentStream = new MemoryStream(attachmentBytes);
                var attachment = new Attachment(attachmentStream, attachmentFileName);
                mail.Attachments.Add(attachment);
            }
            await client.SendMailAsync(mail);
        }
    }
}   