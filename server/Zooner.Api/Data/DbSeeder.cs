using Microsoft.EntityFrameworkCore;
using Zooner.Api.Models;

namespace Zooner.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context, ILogger logger)
    {
        try
        {
            // 1. Seed Business Settings if not existing
            if (!await context.BusinessSettings.AnyAsync())
            {
                context.BusinessSettings.AddRange(
                    new BusinessSetting { Key = "RequestExpirationMinutes", Value = "30", Description = "Live request expiration time in minutes", UpdatedBy = "System" },
                    new BusinessSetting { Key = "MaxSearchRadiusKm", Value = "50", Description = "Maximum allowed search radius in kilometers", UpdatedBy = "System" },
                    new BusinessSetting { Key = "DefaultSearchRadiusKm", Value = "5", Description = "Default search radius in kilometers", UpdatedBy = "System" }
                );
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded default business settings.");
            }

            // 2. Seed Default Admin User if not existing
            var adminEmail = "admin@locallive.com";
            if (!await context.Users.AnyAsync(u => u.Email == adminEmail))
            {
                var admin = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = "LocalLive Administrator",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
                    Role = "Admin",
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };
                context.Users.Add(admin);
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded default administrator account: {Email}", adminEmail);
            }

            // 3. Seed Initial Categories if database missing categories
            if (!await context.Categories.AnyAsync(c => c.Slug == "footwear-sports"))
            {
                var footwear = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Footwear & Sports",
                    Slug = "footwear-sports",
                    Description = "Running shoes, sneakers, athletic apparel, and sports gear",
                    Icon = "shoe",
                    DisplayOrder = 5,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };

                var beauty = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Beauty & Personal Care",
                    Slug = "beauty-personal-care",
                    Description = "Skincare, cosmetics, perfumes, and grooming accessories",
                    Icon = "sparkles",
                    DisplayOrder = 6,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };

                context.Categories.AddRange(footwear, beauty);
                await context.SaveChangesAsync();
            }

            if (!await context.Categories.AnyAsync())
            {
                var clothing = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Clothing & Fashion",
                    Slug = "clothing-fashion",
                    Description = "Men's, women's, and children's apparel, footwear, and accessories",
                    Icon = "shirt",
                    DisplayOrder = 1,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };
                clothing.SubCategories.AddRange(new[]
                {
                    new SubCategory { Id = Guid.NewGuid(), CategoryId = clothing.Id, Name = "Men's Wear", Slug = "mens-wear", Icon = "shirt", DisplayOrder = 1 },
                    new SubCategory { Id = Guid.NewGuid(), CategoryId = clothing.Id, Name = "Women's Wear", Slug = "womens-wear", Icon = "dress", DisplayOrder = 2 },
                    new SubCategory { Id = Guid.NewGuid(), CategoryId = clothing.Id, Name = "Footwear", Slug = "footwear", Icon = "shoe", DisplayOrder = 3 }
                });

                var electronics = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Electronics & Gadgets",
                    Slug = "electronics-gadgets",
                    Description = "Mobile phones, laptops, accessories, and consumer appliances",
                    Icon = "smartphone",
                    DisplayOrder = 2,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };
                electronics.SubCategories.AddRange(new[]
                {
                    new SubCategory { Id = Guid.NewGuid(), CategoryId = electronics.Id, Name = "Mobile Accessories", Slug = "mobile-accessories", Icon = "cable", DisplayOrder = 1 },
                    new SubCategory { Id = Guid.NewGuid(), CategoryId = electronics.Id, Name = "Computers & Laptops", Slug = "computers-laptops", Icon = "laptop", DisplayOrder = 2 }
                });

                var grocery = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Grocery & Essentials",
                    Slug = "grocery-essentials",
                    Description = "Daily groceries, staples, and fresh produce",
                    Icon = "shopping-cart",
                    DisplayOrder = 3,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };

                var pharmacy = new Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Pharmacy & Healthcare",
                    Slug = "pharmacy-healthcare",
                    Description = "Medications, wellness, and personal health supplies",
                    Icon = "pill",
                    DisplayOrder = 4,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };

                context.Categories.AddRange(clothing, electronics, grocery, pharmacy);
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded initial categories and subcategories.");
            }

            // 4. Seed Timed Geo-Targeted Premium Advertisement if none exists
            if (!await context.PremiumAdvertisements.AnyAsync())
            {
                var sampleShop = await context.Shops.FirstOrDefaultAsync();
                if (sampleShop != null)
                {
                    context.PremiumAdvertisements.Add(new PremiumAdvertisement
                    {
                        Id = Guid.NewGuid(),
                        ShopId = sampleShop.Id,
                        Title = "Exclusive RS Puram Flash Sale: 25% Off In-Store",
                        Description = "Special timed walk-in offer for Zooner shoppers near RS Puram & Race Course.",
                        TargetCategory = "running-shoes",
                        TargetRadiusKm = 10.0,
                        StartTimeUtc = DateTime.UtcNow.AddMinutes(-30),
                        EndTimeUtc = DateTime.UtcNow.AddHours(3), // 3-hour timed deal
                        OfferTag = "PREMIUM 25% OFF",
                        IsActive = true,
                        IsPremiumMerchantOnly = true
                    });
                    await context.SaveChangesAsync();
                    logger.LogInformation("Seeded initial targeted timed premium advertisement.");
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred during initial data seeding.");
        }
    }
}
