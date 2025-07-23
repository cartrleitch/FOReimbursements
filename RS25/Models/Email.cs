namespace RS25.Models
{
    public class Email
    {
        public string? Name { get; set; } 
        public required string Type { get; set; }
        public required string Content { get; set; }
    }
}
