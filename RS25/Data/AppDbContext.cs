using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RS25.Models;

namespace RS25.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Reimbursement> Reimbursement { get; set; }
        public DbSet<Purchase> Purchase { get; set; }
        public DbSet<Receipt> Receipt { get; set; }
    }
}