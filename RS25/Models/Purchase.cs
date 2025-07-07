namespace RS25.Models
{
    public class Purchase
    {
        public int Id { get; set; }
        public string? Account { get; set; } // Account to get money reimbursed from
        public string? Description { get; set; } 
        public decimal Amount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int ReimId { get; set; } // Foreign key to Reimbursement

    }
}
