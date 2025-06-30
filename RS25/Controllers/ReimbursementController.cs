using Microsoft.AspNetCore.Mvc;
using RS25.Models;

namespace RS25.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReimbursementController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<ReimbursementController> _logger;

        public ReimbursementController(ILogger<ReimbursementController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<Reimbursement> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new Reimbursement
            {
                DateSubmitted = DateTime.Now.AddDays(index),
                Id = Random.Shared.Next(-20, 55),
                TotalAmount = Random.Shared.Next(100, 1000)
            })
            .ToArray();
        }
    }
}
