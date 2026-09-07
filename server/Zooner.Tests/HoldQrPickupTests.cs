using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Threading.Tasks;
using Xunit;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Services;

namespace Zooner.Tests;

public class HoldQrPickupTests
{
    private AppDbContext CreateInMemoryDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new AppDbContext(options);
    }

    private (User vendor, User customer, Shop shop, StoreInventory inventory) SeedTestData(AppDbContext context)
    {
        var vendor = new User { Id = Guid.NewGuid(), Email = $"vendor_{Guid.NewGuid():N}@zooner.app", Role = "Vendor" };
        var customer = new User { Id = Guid.NewGuid(), Email = $"customer_{Guid.NewGuid():N}@zooner.app", Role = "Customer" };
        var category = new Category { Id = Guid.NewGuid(), Name = "Electronics" };
        var brand = new Brand { Id = Guid.NewGuid(), Name = "Sony" };
        var product = new Product { Id = Guid.NewGuid(), Name = "Sony WH-1000XM5", CategoryId = category.Id, BrandId = brand.Id };
        var variant = new ProductVariant { Id = Guid.NewGuid(), ProductId = product.Id, VariantName = "Black" };
        var shop = new Shop { Id = Guid.NewGuid(), Name = "Croma Electronics", OwnerId = vendor.Id, IsActive = true, IsLiveEnabled = true, VerificationStatus = ShopVerificationStatus.Approved };
        var inventory = new StoreInventory { Id = Guid.NewGuid(), StoreId = shop.Id, ProductVariantId = variant.Id, Price = 26990, Quantity = 5, AvailableQuantity = 5, IsActive = true };

        context.Users.AddRange(vendor, customer);
        context.Categories.Add(category);
        context.Brands.Add(brand);
        context.Products.Add(product);
        context.ProductVariants.Add(variant);
        context.Shops.Add(shop);
        context.StoreInventories.Add(inventory);
        context.SaveChanges();

        return (vendor, customer, shop, inventory);
    }

    [Fact]
    public async Task ReserveHold_Generates_Valid_QrToken()
    {
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateInMemoryDbContext(dbName);
        var service = new InventoryService(context, NullLogger<InventoryService>.Instance);
        var (vendor, customer, shop, inventory) = SeedTestData(context);

        var result = await service.ReserveInventoryHoldAsync(shop.Id, inventory.Id, customer.Id, 1);

        Assert.True(result.Success, result.Message);
        Assert.NotNull(result.Data);
        Assert.False(string.IsNullOrWhiteSpace(result.Data.QrToken));
        Assert.StartsWith("zhold:", result.Data.QrToken);
        Assert.DoesNotContain(customer.Email, result.Data.QrToken); // Ensure no customer PII in QR token
    }

    [Fact]
    public async Task Merchant_Scan_And_Collect_Hold_Succeeds_And_Deducts_Stock()
    {
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateInMemoryDbContext(dbName);
        var service = new InventoryService(context, NullLogger<InventoryService>.Instance);
        var (vendor, customer, shop, inventory) = SeedTestData(context);

        var reserveRes = await service.ReserveInventoryHoldAsync(shop.Id, inventory.Id, customer.Id, 1);
        Assert.True(reserveRes.Success, reserveRes.Message);
        var qrToken = reserveRes.Data!.QrToken;
        var holdId = reserveRes.Data.HoldId;

        // 1. Merchant Scans QR Token
        var validateRes = await service.ValidateHoldQrAsync(shop.Id, qrToken, vendor.Id);
        Assert.True(validateRes.Success, validateRes.Message);
        Assert.True(validateRes.Data!.IsValid, validateRes.Data.Message);
        Assert.Equal(holdId, validateRes.Data.Hold!.HoldId);

        // 2. Merchant Marks as Collected
        var collectRes = await service.CollectHoldAsync(shop.Id, holdId, vendor.Id);
        Assert.True(collectRes.Success, collectRes.Message);
        Assert.Equal("Fulfilled", collectRes.Data!.Status);

        // 3. Verify Stock Deduction in Database
        var updatedInv = await context.StoreInventories.FindAsync(inventory.Id);
        Assert.NotNull(updatedInv);
        Assert.Equal(4, updatedInv.Quantity); // Total stock reduced from 5 to 4 upon collection
    }

    [Fact]
    public async Task Replay_Attack_Prevented_Cannot_Collect_Twice()
    {
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateInMemoryDbContext(dbName);
        var service = new InventoryService(context, NullLogger<InventoryService>.Instance);
        var (vendor, customer, shop, inventory) = SeedTestData(context);

        var reserveRes = await service.ReserveInventoryHoldAsync(shop.Id, inventory.Id, customer.Id, 1);
        Assert.True(reserveRes.Success, reserveRes.Message);
        var holdId = reserveRes.Data!.HoldId;

        // First collection succeeds
        var collectFirst = await service.CollectHoldAsync(shop.Id, holdId, vendor.Id);
        Assert.True(collectFirst.Success, collectFirst.Message);

        // Second collection attempt fails (Replay prevention)
        var collectSecond = await service.CollectHoldAsync(shop.Id, holdId, vendor.Id);
        Assert.False(collectSecond.Success);
        Assert.Contains("already been collected", collectSecond.Message);
    }

    [Fact]
    public async Task Wrong_Store_QR_Scan_Is_Rejected()
    {
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateInMemoryDbContext(dbName);
        var service = new InventoryService(context, NullLogger<InventoryService>.Instance);
        var (vendor1, customer, storeA, inventoryA) = SeedTestData(context);

        var vendor2 = new User { Id = Guid.NewGuid(), Email = "vendor2@zooner.app", Role = "Vendor" };
        var storeB = new Shop { Id = Guid.NewGuid(), Name = "Store B", OwnerId = vendor2.Id, IsActive = true };
        context.Users.Add(vendor2);
        context.Shops.Add(storeB);
        await context.SaveChangesAsync();

        var reserveRes = await service.ReserveInventoryHoldAsync(storeA.Id, inventoryA.Id, customer.Id, 1);
        Assert.True(reserveRes.Success, reserveRes.Message);
        var qrToken = reserveRes.Data!.QrToken;

        // Store B scans Store A's hold pass QR code -> Must fail validation
        var validateRes = await service.ValidateHoldQrAsync(storeB.Id, qrToken, vendor2.Id);
        Assert.True(validateRes.Success);
        Assert.False(validateRes.Data!.IsValid);
        Assert.Contains("belongs to a different store", validateRes.Data.Message);
    }

    [Fact]
    public async Task Expired_Hold_QR_Scan_Is_Rejected()
    {
        var dbName = Guid.NewGuid().ToString();
        using var context = CreateInMemoryDbContext(dbName);
        var service = new InventoryService(context, NullLogger<InventoryService>.Instance);
        var (vendor, customer, shop, inventory) = SeedTestData(context);

        // Create an already expired hold
        var expiredHold = new InventoryHold
        {
            Id = Guid.NewGuid(),
            StoreId = shop.Id,
            StoreInventoryId = inventory.Id,
            CustomerId = customer.Id,
            Quantity = 1,
            HoldCode = "H-9999",
            QrToken = "zhold:expired-token",
            Status = InventoryHoldStatus.Active,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(-10), // Expired 10 mins ago
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-40)
        };

        context.InventoryHolds.Add(expiredHold);
        await context.SaveChangesAsync();

        // Scan expired QR -> Validation returns invalid due to expiration
        var validateRes = await service.ValidateHoldQrAsync(shop.Id, expiredHold.QrToken, vendor.Id);
        Assert.True(validateRes.Success);
        Assert.False(validateRes.Data!.IsValid);
        Assert.Contains("expired", validateRes.Data.Message);
    }
}
