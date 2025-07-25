namespace RS25.Models
{
    public class Email
    {
        public string? Name { get; set; } 
        public required string To { get; set; }
        public required string Subject { get; set; }
        public required string Content { get; set; }
    }
}
