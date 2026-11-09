using Microsoft.AspNetCore.Mvc;
using RS25.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.WebUtilities;
using RS25.Services;

namespace RS25.Controllers
{
    public record ForgotPasswordRequest(string EmailAddress);
    public record ResetPasswordRequest(string EmailAddress, string Token, string NewPassword);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthController(UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager,
                              IConfiguration config,
                              IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            var user = await _userManager.FindByEmailAsync(login.EmailAddress);
            Console.WriteLine($"<---- User: {user}");

            if (user == null)
            {
                Console.WriteLine("<---- User not found, returning Unauthorized");
                return Unauthorized("Invalid credentials");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);
            if (!result.Succeeded)
            {
                Console.WriteLine("<---- Password: User not found, returning Unauthorized");
                return Unauthorized("Invalid credentials");
            }

            var roles = await _userManager.GetRolesAsync(user);
            Console.WriteLine($"<---- User roles: {string.Join(", ", roles)}");

            var claims = new List<Claim>
        {
            new Claim("id", user.Id),
            new Claim("username", user.UserName ?? ""),
            new Claim("email", user.EmailAddress ?? ""),
            new Claim("firstName", user.FirstName ?? ""),
            new Claim("lastName", user.LastName ?? ""),
            new Claim("phoneNumber", user.PhoneNumber ?? ""),
            new Claim("address", user.Address ?? ""),
            new Claim("city", user.City ?? ""),
            new Claim("state", user.State ?? ""),
            new Claim("zipCode", user.ZipCode ?? "")
        };

            foreach (var role in roles)
            {
                claims.Add(new Claim("role", role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.EmailAddress);
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var clientUrl = _config["Client:BaseUrl"] ?? "http://localhost:3000";
                var resetLink = $"{clientUrl}/Account/passwordreset?email={user.EmailAddress}&token={encodedToken}";

                try
                {
                    await _emailService.SendAsync(user.EmailAddress, "Password Reset Request", $"Click the link to reset your password: <a href='{resetLink}'>here</a>", isHtml: true);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email: {ex.Message}");
                }
            }
            return Ok(new { message = "If a user with that email exists, a password reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.EmailAddress);
            if (user == null)
            {
                return BadRequest("Invalid request");
            }
            string token;
           
            try
            {
                token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Token));
            }
            catch (Exception)
            {
                return BadRequest("Invalid token");
            }

            var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }
            return Ok(new { message = "Password has been reset successfully" });
        }
    }
}