using Microsoft.Extensions.Logging.Abstractions;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Tests;

public class ShopServiceTests
{
    [Fact]
    public async Task CreateShop_Initializes_OperatingHours_And_Categories()
    {
        using var context = TestDbContextFactory.Create(nameof(CreateShop_Initializes_OperatingHours_And_Categories));
        var shopService = new ShopService(context, NullLogger<ShopService>.Instance);
        var catService = new CategoryService(context);

        var owner = new User { Id = Guid.NewGuid(), FullName = "Shop Owner", Email = "owner@test.com", PasswordHash = "hash", Role = "ShopOwner" };
        context.Users.Add(owner);
        await context.SaveChangesAsync();

        var cat = await catService.CreateCategoryAsync(new CreateCategoryRequest { Name = "Fashion" });

        var shopRes = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "Prime Clothing",
            Description = "Trendy outfits",
            Phone = "1234567890",
            Address = "100 Main St, City",
            Latitude = 11.0168,
            Longitude = 76.9558,
            CategoryIds = [cat.Data!.Id]
        });

        Assert.True(shopRes.Success);
        Assert.NotNull(shopRes.Data);
        Assert.True(shopRes.Data.IsLiveEnabled);
        Assert.Single(shopRes.Data.Categories);
        Assert.Equal(7, shopRes.Data.OperatingHours.Count); // Default 7 days
    }

    [Fact]
    public async Task UpdateShop_By_NonOwner_Fails()
    {
        using var context = TestDbContextFactory.Create(nameof(UpdateShop_By_NonOwner_Fails));
        var shopService = new ShopService(context, NullLogger<ShopService>.Instance);

        var owner = new User { Id = Guid.NewGuid(), FullName = "Owner", Email = "o@test.com", PasswordHash = "h" };
        var intruder = new User { Id = Guid.NewGuid(), FullName = "Intruder", Email = "i@test.com", PasswordHash = "h" };
        context.Users.AddRange(owner, intruder);
        await context.SaveChangesAsync();

        var shopRes = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "Store 1",
            Phone = "123",
            Address = "Road"
        });

        var updateRes = await shopService.UpdateShopAsync(intruder.Id, shopRes.Data!.Id, new UpdateShopRequest
        {
            Name = "Hacked Store",
            Phone = "000",
            Address = "Nowhere"
        });

        Assert.False(updateRes.Success);
        Assert.Contains("not authorized", updateRes.Message.ToLower());
    }

    [Fact]
    public async Task ToggleLiveStatus_Toggles_Live_Availability()
    {
        using var context = TestDbContextFactory.Create(nameof(ToggleLiveStatus_Toggles_Live_Availability));
        var shopService = new ShopService(context, NullLogger<ShopService>.Instance);

        var owner = new User { Id = Guid.NewGuid(), FullName = "Owner", Email = "toggle@test.com", PasswordHash = "h" };
        context.Users.Add(owner);
        await context.SaveChangesAsync();

        var shopRes = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest { Name = "Live Store", Phone = "111", Address = "Street" });

        // Turn offline
        var toggleOff = await shopService.ToggleLiveStatusAsync(owner.Id, shopRes.Data!.Id, false);
        Assert.True(toggleOff.Success);

        var fetched = await shopService.GetShopByIdAsync(shopRes.Data.Id);
        Assert.False(fetched.Data!.IsLiveEnabled);
    }
}
