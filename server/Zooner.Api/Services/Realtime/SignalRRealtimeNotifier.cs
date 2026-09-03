using Microsoft.AspNetCore.SignalR;
using Zooner.Api.Hubs;
using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services.Realtime;

public class SignalRRealtimeNotifier : IRealtimeNotifier
{
    private readonly IHubContext<LiveHub> _hubContext;
    private readonly ILogger<SignalRRealtimeNotifier> _logger;

    public SignalRRealtimeNotifier(IHubContext<LiveHub> hubContext, ILogger<SignalRRealtimeNotifier> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task NotifyNewLiveRequestAsync(IEnumerable<Guid> shopIds, LiveRequestSummaryDto request)
    {
        foreach (var shopId in shopIds)
        {
            try
            {
                await _hubContext.Clients.Group($"shop_{shopId}").SendAsync("NewLiveRequest", request);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to broadcast NewLiveRequest to shop {ShopId}", shopId);
            }
        }
    }

    public async Task NotifyShopAvailableAsync(Guid customerUserId, ShopAvailableNotificationDto notification)
    {
        try
        {
            await _hubContext.Clients.Group($"user_{customerUserId}").SendAsync("ShopAvailable", notification);
            // Also notify anyone watching the request group
            await _hubContext.Clients.Group($"request_{notification.LiveRequestId}").SendAsync("ShopAvailable", notification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send ShopAvailable to customer {UserId}", customerUserId);
        }
    }

    public async Task NotifyRequestExpiredAsync(Guid customerUserId, IEnumerable<Guid> shopIds, Guid requestId)
    {
        var payload = new { RequestId = requestId, Reason = "Expired" };
        try
        {
            await _hubContext.Clients.Group($"user_{customerUserId}").SendAsync("RequestExpired", payload);
            await _hubContext.Clients.Group($"request_{requestId}").SendAsync("RequestExpired", payload);
            foreach (var shopId in shopIds)
            {
                await _hubContext.Clients.Group($"shop_{shopId}").SendAsync("RequestExpired", payload);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to broadcast RequestExpired for request {RequestId}", requestId);
        }
    }

    public async Task NotifyRequestCancelledAsync(IEnumerable<Guid> shopIds, Guid requestId)
    {
        var payload = new { RequestId = requestId, Reason = "Cancelled" };
        try
        {
            await _hubContext.Clients.Group($"request_{requestId}").SendAsync("RequestCancelled", payload);
            foreach (var shopId in shopIds)
            {
                await _hubContext.Clients.Group($"shop_{shopId}").SendAsync("RequestCancelled", payload);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to broadcast RequestCancelled for request {RequestId}", requestId);
        }
    }

    public async Task NotifyChatMessageAsync(Guid recipientUserId, ChatMessageDto message)
    {
        try
        {
            await _hubContext.Clients.Group($"user_{recipientUserId}").SendAsync("ChatMessageReceived", message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to deliver ChatMessage to user {UserId}", recipientUserId);
        }
    }

    public async Task SendUserNotificationAsync(Guid userId, NotificationDto notification)
    {
        try
        {
            await _hubContext.Clients.Group($"user_{userId}").SendAsync("NotificationReceived", notification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send user notification to {UserId}", userId);
        }
    }
}
