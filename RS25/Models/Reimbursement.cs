namespace RS25.Models
{
    public class Reimbursement
    {
        public int Id { get; set; }

        public string? Vendor { get; set; } // e.g., Vendor Name
        public string? VendorAddress { get; set; } // e.g., Vendor Address
        public string? VendorWebsite { get; set; } // e.g., Vendor Phone Number
        // public string? Description { get; set; } // of each purchase, Associative Table needed, same with Account and Amount for each
        public decimal TotalAmount { get; set; }
        public DateTime DateSubmitted { get; set; }
        public string? PaymentMethod { get; set; } // e.g., Credit Card, Cash, Bank Transfer
        public string? Status { get; set; } // e.g., Pending, Approved, Rejected
        // public string EmployeeId { get; set; } // Foreign key to Employee
        // public string ManagerId { get; set; } // Foreign key to Manager
        public DateTime? DateApproved { get; set; } // Nullable if not yet approved
        // public string Comments { get; set; } // Optional comments from the managers

    }
}
