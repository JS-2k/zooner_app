using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services.Realtime;

public interface IRealtimeNotifier
{
    Task NotifyNewLiveRequestAsync(IEnumerable<Guid> shopIds, LiveRequestSummaryDto request);
    Task NotifyShopAvailableAsync(Guid customerUserId, ShopAvailableNotificationDto notification);
    Task NotifyRequestExpiredAsync(Guid customerUserId, IEnumerable<Guid> shopIds, Guid requestId);
    Task NotifyRequestCancelledAsync(IEnumerable<Guid> shopIds, Guid requestId);
    Task NotifyChatMessageAsync(Guid recipientUserId, ChatMessageDto message);
    Task SendUserNotificationAsync(Guid userId, NotificationDto notification);
}
