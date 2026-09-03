using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;
using Zooner.Api.Services.Realtime;

namespace Zooner.Tests;

public class LiveRequestLifecycleTests
{
    [Fact]
    public async Task LiveRequest_Full_Lifecycle_And_Duplicate_Response_Prevention()
    {
        using var context = TestDbContextFactory.Create(nameof(LiveRequest_Full_Lifecycle_And_Duplicate_Response_Prevention));
        var notifierMock = new Mock<IRealtimeNotifier>();

        var shopService = new ShopService(context, NullLogger<ShopService>.Instance);
        var liveRequestService = new LiveRequestService(context, shopService, notifierMock.Object, NullLogger<LiveRequestService>.Instance);
        var catService = new CategoryService(context);

        // 1. Setup Customer and Shop Owner
        var customer = new User { Id = Guid.NewGuid(), FullName = "Alice Customer", Email = "alice@test.com", PasswordHash = "h", Role = "Customer" };
        var shopOwner = new User { Id = Guid.NewGuid(), FullName = "Bob Merchant", Email = "bob@test.com", PasswordHash = "h", Role = "ShopOwner" };
        context.Users.AddRange(customer, shopOwner);
        await context.SaveChangesAsync();

        var category = await catService.CreateCategoryAsync(new CreateCategoryRequest { Name = "Footwear" });

        var shop = await shopService.CreateShopAsync(shopOwner.Id, new CreateShopRequest
        {
            Name = "Bob Shoes",
            Phone = "9998887770",
            Address = "Downtown Market",
            Latitude = 11.0100,
            Longitude = 76.9600,
            CategoryIds = [category.Data!.Id]
        });

        // 2. Customer creates Live Request
        var createReq = new CreateLiveRequest
        {
            RequestText = "Need running shoes size 10",
            CategoryId = category.Data.Id,
            Latitude = 11.0110,
            Longitude = 76.9600,
            SearchRadiusKm = 5.0
        };

        var requestRes = await liveRequestService.CreateRequestAsync(customer.Id, createReq);
        Assert.True(requestRes.Success);
        Assert.NotNull(requestRes.Data);
        Assert.Equal("Active", requestRes.Data.Status);

        // Verify RealtimeNotifier was called for nearby shops
        notifierMock.Verify(n => n.NotifyNewLiveRequestAsync(
            It.Is<IEnumerable<Guid>>(ids => ids.Contains(shop.Data!.Id)),
            It.IsAny<LiveRequestSummaryDto>()), Times.Once);

        // 3. Shop responds AVAILABLE
        var responseRes = await liveRequestService.RespondAvailableAsync(shopOwner.Id, requestRes.Data.Id, shop.Data!.Id);
        Assert.True(responseRes.Success);
        Assert.Equal("Available", responseRes.Data!.Status);

        // Verify customer received realtime update
        notifierMock.Verify(n => n.NotifyShopAvailableAsync(
            customer.Id,
            It.Is<ShopAvailableNotificationDto>(dto => dto.ShopId == shop.Data.Id)), Times.Once);

        // 4. DUPLICATE RESPONSE PREVENTION TEST: Shop responds again -> MUST FAIL
        var duplicateRes = await liveRequestService.RespondAvailableAsync(shopOwner.Id, requestRes.Data.Id, shop.Data.Id);
        Assert.False(duplicateRes.Success);
        Assert.Contains("already responded", duplicateRes.Message.ToLower());

        // 5. Customer selects shop
        var selectRes = await liveRequestService.SelectShopAsync(customer.Id, requestRes.Data.Id, shop.Data.Id);
        Assert.True(selectRes.Success);
        Assert.Equal(shop.Data.Id, selectRes.Data!.SelectedShopId);

        // Verify conversation was created
        var conversationExists = context.Conversations.Any(c => c.LiveRequestId == requestRes.Data.Id && c.ShopId == shop.Data.Id);
        Assert.True(conversationExists);

        // 6. Customer fulfills request
        var fulfillRes = await liveRequestService.FulfillRequestAsync(customer.Id, requestRes.Data.Id);
        Assert.True(fulfillRes.Success);

        var finalRequest = await liveRequestService.GetRequestByIdAsync(requestRes.Data.Id, customer.Id);
        Assert.Equal("Fulfilled", finalRequest.Data!.Status);
    }

    [Fact]
    public async Task Respond_To_Expired_Request_Fails()
    {
        using var context = TestDbContextFactory.Create(nameof(Respond_To_Expired_Request_Fails));
        var notifierMock = new Mock<IRealtimeNotifier>();

        var shopService = new ShopService(context, NullLogger<ShopService>.Instance);
        var liveRequestService = new LiveRequestService(context, shopService, notifierMock.Object, NullLogger<LiveRequestService>.Instance);

        var customer = new User { Id = Guid.NewGuid(), FullName = "C", Email = "c@test.com", PasswordHash = "h" };
        var owner = new User { Id = Guid.NewGuid(), FullName = "O", Email = "o@test.com", PasswordHash = "h" };
        var category = new Category { Id = Guid.NewGuid(), Name = "General", Slug = "general" };
        context.Users.AddRange(customer, owner);
        context.Categories.Add(category);
        await context.SaveChangesAsync();

        var shop = await shopService.CreateShopAsync(owner.Id, new CreateShopRequest
        {
            Name = "S",
            Phone = "1",
            Address = "A",
            Latitude = 11.0,
            Longitude = 76.0,
            CategoryIds = [category.Id]
        });

        var expiredRequest = new LiveRequest
        {
            Id = Guid.NewGuid(),
            CustomerId = customer.Id,
            CategoryId = category.Id,
            RequestText = "Expired request item",
            Latitude = 11.0,
            Longitude = 76.0,
            Status = LiveRequestStatus.Active,
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-60),
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(-30) // Expired 30 mins ago
        };
        context.LiveRequests.Add(expiredRequest);
        await context.SaveChangesAsync();

        var res = await liveRequestService.RespondAvailableAsync(owner.Id, expiredRequest.Id, shop.Data!.Id);

        Assert.False(res.Success);
        Assert.Contains("expired", res.Message.ToLower());
    }
}
