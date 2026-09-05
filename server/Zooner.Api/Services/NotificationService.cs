using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<NotificationDto>>> GetUserNotificationsAsync(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAtUtc)
            .Take(50)
            .AsNoTracking()
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                RelatedEntityId = n.RelatedEntityId,
                IsRead = n.IsRead,
                CreatedAtUtc = n.CreatedAtUtc
            })
            .ToListAsync();

        return ApiResponse<List<NotificationDto>>.Ok(notifications);
    }

    public async Task<ApiResponse> MarkAsReadAsync(Guid userId, Guid notificationId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

        if (notification == null)
        {
            return ApiResponse.Fail("Notification not found.");
        }

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return ApiResponse.Ok("Notification marked as read.");
    }

    public async Task<ApiResponse> MarkAllAsReadAsync(Guid userId)
    {
        var unread = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in unread)
        {
            n.IsRead = true;
        }

        await _context.SaveChangesAsync();
        return ApiResponse.Ok("All notifications marked as read.");
    }
}
