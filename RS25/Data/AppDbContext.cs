using Microsoft.EntityFrameworkCore;
using RS25.Models;

namespace RS25.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Reimbursement> Reimbursement { get; set; }
        public DbSet<Purchase> Purchase { get; set; }
        public DbSet<Receipt> Receipt { get; set; }
    }
}