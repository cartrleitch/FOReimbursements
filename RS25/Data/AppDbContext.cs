using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RS25.Models;

namespace RS25.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Reimbursement> Reimbursement { get; set; }
        public DbSet<Purchase> Purchase { get; set; }
        public DbSet<Receipt> Receipt { get; set; }
        public DbSet<Vendor> Vendor { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Apply global query filter to exclude soft-deleted users
            builder.Entity<ApplicationUser>().HasQueryFilter(u => !u.IsDeleted);
        }
    }
}