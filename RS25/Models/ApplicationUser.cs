using Microsoft.AspNetCore.Identity;

public class ApplicationUser: IdentityUser
{
	public override string Id { get; set; } = null!; 
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public string? EmailAddress { get; set; }
	public override string? PhoneNumber { get; set; }
	public string? Address { get; set; }
	public string? City { get; set; }
	public string? State { get; set; }
	public string? ZipCode { get; set; }
}