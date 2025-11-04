namespace RS25.Models
{
    public class Email
    {
        public string? Name { get; set; } 
        public required string To { get; set; }
        public required string Subject { get; set; }
        public required string Content { get; set; }
        public string? AttachmentB64 { get; set; } 
        public string? AttachmentFileName { get; set; }
    }
}
