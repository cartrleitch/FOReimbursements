using Microsoft.AspNetCore.Identity;
using DotNetEnv;

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
            Env.Load();

            var adminEmailDefault = Environment.GetEnvironmentVariable("ADMIN_SEED_EMAIL")!;
            var adminPasswordDefault = Environment.GetEnvironmentVariable("ADMIN_SEED_PASSWORD")!;

            var userEmailDefault = Environment.GetEnvironmentVariable("USER_SEED_EMAIL")!;
            var userPasswordDefault = Environment.GetEnvironmentVariable("USER_SEED_PASSWORD")!;

            var adminUser = await userManager.FindByEmailAsync(adminEmailDefault);
            var defaultUser = await userManager.FindByEmailAsync(userEmailDefault);

            if (adminUser == null)
            {
                Console.WriteLine("<---- Admin user not found, creating a new one...");
                // Create the admin user if it does not exist
                adminUser = new ApplicationUser
                {
                    FirstName = "Carter",
                    LastName = "Leitch",
                    EmailAddress = adminEmailDefault,
                    Email = adminEmailDefault,
                    UserName = adminEmailDefault
                };
                var result = await userManager.CreateAsync(adminUser, adminPasswordDefault);
                Console.WriteLine($"<---- Admin user creation result: {result}");
                if (result.Succeeded)
                {
                    // Assign the admin role to the user
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    Console.WriteLine("<---- Admin user created and assigned to Admin role.");
                }
            }

            if (defaultUser == null)
            {
                Console.WriteLine("<---- Default user not found, creating a new one...");
                // Create the default user if it does not exist
                defaultUser = new ApplicationUser
                {
                    FirstName = "Carter",
                    LastName = "Leitch",
                    EmailAddress = userEmailDefault,
                    Email = userEmailDefault,
                    UserName = userEmailDefault
                };
                var result = await userManager.CreateAsync(defaultUser, userPasswordDefault);
                Console.WriteLine($"<---- Default user creation result: {result}");
                if (result.Succeeded)
                {
                    // Assign the user role to the user
                    await userManager.AddToRoleAsync(defaultUser, "User");
                    Console.WriteLine("<---- Default user created and assigned to User role.");
                }
            }

        }
    }
}