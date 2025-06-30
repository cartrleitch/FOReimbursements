using Microsoft.EntityFrameworkCore;
using RS25.Models;

namespace RS25.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<WeatherForecast> WeatherForecast { get; set; }
    }
}