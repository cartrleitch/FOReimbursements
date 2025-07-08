namespace RS25.Models
{
	public class Receipt
	{
		public int Id { get; set; }
		public string? FileName { get; set; } // Name of the receipt file
		public string? FilePath { get; set; } // Path to the receipt file
		public DateTime UploadDate { get; set; } // Date when the receipt was uploaded
		public int PurId { get; set; } // Foreign key to Purchase

	}
}
