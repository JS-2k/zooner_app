using Microsoft.Extensions.Logging.Abstractions;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Tests;

public class NearbyMatchingTests
{
    [Fact]
    public async Task FindNearbyEligibleShops_Filters_By_Radius_Category_And_LiveStatus()
    {
        using var context = TestDbContextFactory.Create(nameof(FindNearbyEligibleShops_Filters_By_Radius_Category_And_LiveStatus));
        var shopService = new ShopService(context, NullLogger<ShopService>.Instance);
        var catService = new CategoryService(context);

        var owner = new User { Id = Guid.NewGuid(), FullName = "Owner", Email = "owner@test.com", PasswordHash = "h" };
        context.Users.Add(owner);
        await context.SaveChangesAsync();

        var apparelCat = await catService.CreateCategoryAsync(new CreateCategoryRequest { Name = "Apparel" });
        var foodCat = await catService.CreateCategoryAsync(new CreateCategoryRequest { Name = "Food" });

        // Center location: (11.0000, 76.9600)
        double centerLat = 11.0000;
        double centerLon = 76.9600;

        // Shop 1: Nearby (approx 1 km), Apparel, LiveEnabled = true => SHOULD MATCH
        var shop1 = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "Nearby Apparel",
            Phone = "1",
            Address = "A",
            Latitude = 11.0090,
            Longitude = 76.9600,
            CategoryIds = [apparelCat.Data!.Id]
        });

        // Shop 2: Far (approx 20 km away), Apparel, LiveEnabled = true => OUT OF 5KM RADIUS
        var shop2 = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "Far Apparel",
            Phone = "2",
            Address = "B",
            Latitude = 11.1800,
            Longitude = 76.9600,
            CategoryIds = [apparelCat.Data!.Id]
        });

        // Shop 3: Nearby, Apparel, but LiveEnabled = false => SHOULD BE EXCLUDED
        var shop3 = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "Offline Apparel",
            Phone = "3",
            Address = "C",
            Latitude = 11.0050,
            Longitude = 76.9600,
            CategoryIds = [apparelCat.Data!.Id]
        });
        await shopService.ToggleLiveStatusAsync(owner.Id, shop3.Data!.Id, false);

        // Shop 4: Nearby, but Food category => CATEGORY MISMATCH
        var shop4 = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "Nearby Food",
            Phone = "4",
            Address = "D",
            Latitude = 11.0050,
            Longitude = 76.9600,
            CategoryIds = [foodCat.Data!.Id]
        });

        // Query within 5 km radius for Apparel
        var matches = await shopService.FindNearbyEligibleShopsAsync(centerLat, centerLon, radiusKm: 5.0, categoryId: apparelCat.Data.Id);

        Assert.Single(matches);
        Assert.Equal("Nearby Apparel", matches[0].Name);
    }
}
