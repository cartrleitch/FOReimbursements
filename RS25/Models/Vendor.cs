using RS25.Models;

namespace RS25.Models
{
    // Vendor is the person or company being reimbursed if it is not the user. 
    public class Vendor
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Website { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
    }
}