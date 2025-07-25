using RS25.Models;
using Microsoft.AspNetCore.Identity;

namespace RS25.Data
{
    public class SeedRoles
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roleNames = { "Admin", "User" };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    // Create the roles and seed them to the database
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            var adminEmailDefault = "carterleitch@gmail.com";
            var adminPasswordDefault = "password";

            var adminUser = await userManager.FindByEmailAsync(adminEmailDefault);
            if (adminUser == null)
            {
                // Create the admin user if it does not exist
                adminUser = new ApplicationUser
                {
                    FirstName = "Carter",
                    LastName = "Leitch",
                    EmailAddress = adminEmailDefault

                };
                var result = await userManager.CreateAsync(adminUser, adminPasswordDefault);
                if (result.Succeeded)
                {
                    // Assign the admin role to the user
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

        }
    }
}