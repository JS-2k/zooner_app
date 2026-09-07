using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Tests;

public class ProductionReadinessTests
{
    private readonly IConfiguration _config = new ConfigurationBuilder().Build();

    [Fact]
    public async Task StoreRegistration_Defaults_To_Pending_Verification()
    {
        using var context = TestDbContextFactory.Create(nameof(StoreRegistration_Defaults_To_Pending_Verification));
        var shopService = new ShopService(context, _config, NullLogger<ShopService>.Instance);

        var owner = new User
        {
            Id = Guid.NewGuid(),
            FullName = "New Retailer",
            Email = "retailer@example.com",
            PasswordHash = "hash",
            Role = "Customer"
        };
        context.Users.Add(owner);
        await context.SaveChangesAsync();

        var res = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "ElectroHub",
            Description = "Gadgets",
            Phone = "9876543210",
            Address = "123 Tech Park, Coimbatore",
            Latitude = 11.0168,
            Longitude = 76.9558
        });

        Assert.True(res.Success);
        Assert.NotNull(res.Data);
        // CRITICAL: New store in production must be Pending, NOT auto-approved
        Assert.Equal("Pending", res.Data.VerificationStatus);
    }

    [Fact]
    public async Task Unverified_Store_Inventory_Hidden_From_Public_Search()
    {
        using var context = TestDbContextFactory.Create(nameof(Unverified_Store_Inventory_Hidden_From_Public_Search));
        var productService = new ProductService(context, NullLogger<ProductService>.Instance);

        var owner = new User { Id = Guid.NewGuid(), FullName = "Owner", Email = "owner@test.com", PasswordHash = "h" };
        var category = new Category { Id = Guid.NewGuid(), Name = "Electronics", Slug = "electronics" };
        var pendingShop = new Shop
        {
            Id = Guid.NewGuid(),
            OwnerId = owner.Id,
            Name = "Pending Mobile Store",
            Phone = "12345",
            Address = "Road",
            VerificationStatus = ShopVerificationStatus.Pending, // NOT approved
            IsActive = true
        };

        var product = new Product
        {
            Id = Guid.NewGuid(),
            CategoryId = category.Id,
            Category = category,
            Name = "Flagship Smartphone Pro",
            NormalizedName = "FLAGSHIP SMARTPHONE PRO",
            IsActive = true
        };



        var variant = new ProductVariant
        {
            Id = Guid.NewGuid(),
            ProductId = product.Id,
            VariantName = "256GB Black",
            IsActive = true
        };

        var inventory = new StoreInventory
        {
            Id = Guid.NewGuid(),
            StoreId = pendingShop.Id,
            ProductVariantId = variant.Id,
            Price = 69999m,
            Quantity = 10,
            AvailableQuantity = 10,
            IsActive = true
        };

        product.Variants.Add(variant);
        inventory.Store = pendingShop;
        inventory.ProductVariant = variant;

        context.Users.Add(owner);
        context.Categories.Add(category);
        context.Shops.Add(pendingShop);
        context.Products.Add(product);
        context.ProductVariants.Add(variant);
        context.StoreInventories.Add(inventory);
        await context.SaveChangesAsync();



        // Customer searches for product
        var searchResult = await productService.SearchProductsAsync("Smartphone", null, null, null);
        Assert.True(searchResult.Success);
        var foundProduct = searchResult.Data!.FirstOrDefault(p => p.Id == product.Id);
        
        // Unapproved store inventory must NOT be exposed in carrying stores
        Assert.NotNull(foundProduct);
        Assert.Equal(0, foundProduct.NearbyStoresCount);
        Assert.Empty(foundProduct.CarryingStores);

        var storesResult = await productService.GetProductStoresAsync(product.Id, null, null);
        Assert.Empty(storesResult.Data!);
    }

    [Fact]
    public async Task InventoryHold_AtomicReservation_Enforces_QuantityBounds_And_Stock()
    {
        using var context = TestDbContextFactory.Create(nameof(InventoryHold_AtomicReservation_Enforces_QuantityBounds_And_Stock));
        var inventoryService = new InventoryService(context, NullLogger<InventoryService>.Instance);

        var customer = new User { Id = Guid.NewGuid(), FullName = "Shopper", Email = "shopper@test.com", PasswordHash = "h" };
        var shop = new Shop { Id = Guid.NewGuid(), OwnerId = Guid.NewGuid(), Name = "Electronics Corner", Phone = "123", Address = "Mall", IsActive = true, VerificationStatus = ShopVerificationStatus.Approved };
        var product = new Product { Id = Guid.NewGuid(), Name = "Noise Cancelling Headphones", NormalizedName = "noise cancelling headphones", IsActive = true };
        var variant = new ProductVariant { Id = Guid.NewGuid(), ProductId = product.Id, VariantName = "Black", IsActive = true };
        var inv = new StoreInventory { Id = Guid.NewGuid(), StoreId = shop.Id, ProductVariantId = variant.Id, Price = 14999m, Quantity = 2, AvailableQuantity = 2, IsActive = true };

        context.Users.Add(customer);
        context.Shops.Add(shop);
        context.Products.Add(product);
        context.ProductVariants.Add(variant);
        context.StoreInventories.Add(inv);
        await context.SaveChangesAsync();

        // Test 1: Invalid bounds (> 5)
        var excessHold = await inventoryService.ReserveInventoryHoldAsync(shop.Id, inv.Id, customer.Id, 10);
        Assert.False(excessHold.Success);
        Assert.Contains("between 1 and 5", excessHold.Message);

        // Test 2: Successful hold of 1 item
        var holdRes = await inventoryService.ReserveInventoryHoldAsync(shop.Id, inv.Id, customer.Id, 1);
        Assert.True(holdRes.Success);
        Assert.NotNull(holdRes.Data);
        Assert.StartsWith("H-", holdRes.Data.HoldCode);

        // Verify stock decremented
        var updatedInv = await context.StoreInventories.FindAsync(inv.Id);
        Assert.Equal(1, updatedInv!.AvailableQuantity);

        // Test 3: Prevent duplicate concurrent active holds by same user on same item
        var dupHold = await inventoryService.ReserveInventoryHoldAsync(shop.Id, inv.Id, customer.Id, 1);
        Assert.False(dupHold.Success);
        Assert.Contains("already have an active hold pass", dupHold.Message);
    }

    [Fact]
    public async Task InventoryHold_Release_Restores_Stock_And_Requires_Authorization()
    {
        using var context = TestDbContextFactory.Create(nameof(InventoryHold_Release_Restores_Stock_And_Requires_Authorization));
        var inventoryService = new InventoryService(context, NullLogger<InventoryService>.Instance);

        var owner = new User { Id = Guid.NewGuid(), FullName = "Owner", Email = "owner@test.com", PasswordHash = "h" };
        var customer = new User { Id = Guid.NewGuid(), FullName = "Customer", Email = "customer@test.com", PasswordHash = "h" };
        var intruder = new User { Id = Guid.NewGuid(), FullName = "Intruder", Email = "intruder@test.com", PasswordHash = "h" };

        var shop = new Shop { Id = Guid.NewGuid(), OwnerId = owner.Id, Name = "Shoe Store", Phone = "123", Address = "St", IsActive = true, VerificationStatus = ShopVerificationStatus.Approved };
        var product = new Product { Id = Guid.NewGuid(), Name = "Running Shoes", NormalizedName = "running shoes", IsActive = true };
        var variant = new ProductVariant { Id = Guid.NewGuid(), ProductId = product.Id, VariantName = "UK 9", IsActive = true };
        var inv = new StoreInventory { Id = Guid.NewGuid(), StoreId = shop.Id, ProductVariantId = variant.Id, Price = 4999m, Quantity = 5, AvailableQuantity = 5, IsActive = true };

        context.Users.AddRange(owner, customer, intruder);
        context.Shops.Add(shop);
        context.Products.Add(product);
        context.ProductVariants.Add(variant);
        context.StoreInventories.Add(inv);
        await context.SaveChangesAsync();

        var holdRes = await inventoryService.ReserveInventoryHoldAsync(shop.Id, inv.Id, customer.Id, 2);
        Assert.True(holdRes.Success);

        // Intruder attempts to cancel/release customer's hold
        var intruderRelease = await inventoryService.ReleaseInventoryHoldAsync(shop.Id, inv.Id, holdRes.Data!.HoldId, intruder.Id);
        Assert.False(intruderRelease.Success);
        Assert.Contains("Unauthorized", intruderRelease.Message);

        // Legitimate customer releases their own hold
        var customerRelease = await inventoryService.ReleaseInventoryHoldAsync(shop.Id, inv.Id, holdRes.Data.HoldId, customer.Id);
        Assert.True(customerRelease.Success);

        var refreshedInv = await context.StoreInventories.FindAsync(inv.Id);
        Assert.Equal(5, refreshedInv!.AvailableQuantity); // Restored back to 5
    }

    [Fact]
    public async Task Vendor_Isolation_Cannot_Modify_Another_Vendor_Inventory()
    {
        using var context = TestDbContextFactory.Create(nameof(Vendor_Isolation_Cannot_Modify_Another_Vendor_Inventory));
        var inventoryService = new InventoryService(context, NullLogger<InventoryService>.Instance);

        var vendorA = new User { Id = Guid.NewGuid(), FullName = "Vendor A", Email = "va@test.com", PasswordHash = "h" };
        var vendorB = new User { Id = Guid.NewGuid(), FullName = "Vendor B", Email = "vb@test.com", PasswordHash = "h" };

        var shopA = new Shop { Id = Guid.NewGuid(), OwnerId = vendorA.Id, Name = "Shop A", Phone = "1", Address = "A", IsActive = true };
        var product = new Product { Id = Guid.NewGuid(), Name = "Gadget", NormalizedName = "gadget", IsActive = true };
        var variant = new ProductVariant { Id = Guid.NewGuid(), ProductId = product.Id, VariantName = "V1", IsActive = true };
        var invA = new StoreInventory { Id = Guid.NewGuid(), StoreId = shopA.Id, ProductVariantId = variant.Id, Price = 1000m, Quantity = 10, AvailableQuantity = 10, IsActive = true };

        context.Users.AddRange(vendorA, vendorB);
        context.Shops.Add(shopA);
        context.Products.Add(product);
        context.ProductVariants.Add(variant);
        context.StoreInventories.Add(invA);
        await context.SaveChangesAsync();

        // Vendor B attempts to update Vendor A's inventory
        var updateRes = await inventoryService.UpdateStoreInventoryAsync(shopA.Id, invA.Id, vendorB.Id, new UpdateStoreInventoryRequest
        {
            Price = 1m,
            Quantity = 0
        });

        Assert.False(updateRes.Success);
        Assert.Contains("Unauthorized", updateRes.Message);

        // Vendor B attempts to delete Vendor A's inventory
        var deleteRes = await inventoryService.DeleteStoreInventoryAsync(shopA.Id, invA.Id, vendorB.Id);
        Assert.False(deleteRes.Success);
        Assert.Contains("Unauthorized", deleteRes.Message);
    }

    [Fact]
    public async Task Single_User_Dual_Capability_Customer_And_Vendor()
    {
        using var context = TestDbContextFactory.Create(nameof(Single_User_Dual_Capability_Customer_And_Vendor));
        var shopService = new ShopService(context, _config, NullLogger<ShopService>.Instance);

        // User registers as regular customer
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Multi Role User",
            Email = "multirole@zooner.in",
            PasswordHash = "hash",
            Role = "Customer"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Same user registers their physical shop without creating a second account
        var shopRes = await shopService.CreateShopAsync(user.Id, new CreateShopRequest
        {
            Name = "MultiRole Stationery",
            Phone = "9944123456",
            Address = "Crosscut Road, Coimbatore"
        });

        Assert.True(shopRes.Success);

        // User can retrieve their owned shops
        var myShops = await shopService.GetMyShopsAsync(user.Id);
        Assert.Single(myShops.Data!);
        Assert.Equal("MultiRole Stationery", myShops.Data![0].Name);
    }
}
