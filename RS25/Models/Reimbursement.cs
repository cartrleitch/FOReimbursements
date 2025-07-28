namespace RS25.Models
{
    public class Reimbursement
    {
        public int Id { get; set; }
        public string? VendorId  { get; set; }
        public string? UserId { get; set; }
        public string? ActionRequested { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime DateSubmitted { get; set; }
        public string? PaymentMethod { get; set; } // e.g., Credit Card, Cash, Bank Transfer
        public string? Status { get; set; } // e.g., Pending, Approved, Rejected
        public DateTime? DateApproved { get; set; } // Nullable if not yet approved
        // public string Comments { get; set; } // Optional comments from the managers
    }
}
