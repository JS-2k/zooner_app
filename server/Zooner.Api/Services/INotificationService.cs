using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface INotificationService
{
    Task<ApiResponse<List<NotificationDto>>> GetUserNotificationsAsync(Guid userId);
    Task<ApiResponse> MarkAsReadAsync(Guid userId, Guid notificationId);
    Task<ApiResponse> MarkAllAsReadAsync(Guid userId);
}
