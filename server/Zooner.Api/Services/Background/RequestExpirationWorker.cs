using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Services.Realtime;

namespace Zooner.Api.Services.Background;

public class RequestExpirationWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<RequestExpirationWorker> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30);

    public RequestExpirationWorker(IServiceProvider serviceProvider, ILogger<RequestExpirationWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("RequestExpirationWorker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpireStaleRequestsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while expiring stale live requests.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }

        _logger.LogInformation("RequestExpirationWorker stopping.");
    }

    private async Task ExpireStaleRequestsAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var realtimeNotifier = scope.ServiceProvider.GetRequiredService<IRealtimeNotifier>();

        var now = DateTime.UtcNow;

        var staleRequests = await context.LiveRequests
            .Where(r => r.Status == LiveRequestStatus.Active && r.ExpiresAtUtc <= now)
            .Include(r => r.Responses)
            .ToListAsync(cancellationToken);

        if (!staleRequests.Any()) return;

        foreach (var req in staleRequests)
        {
            req.Status = LiveRequestStatus.Expired;

            // Add notification for customer
            context.Notifications.Add(new Notification
            {
                Id = Guid.NewGuid(),
                UserId = req.CustomerId,
                Title = "Live Request Expired",
                Message = $"Your request \"{req.RequestText}\" has expired.",
                Type = "RequestExpired",
                RelatedEntityId = req.Id,
                CreatedAtUtc = now
            });

            var shopIds = req.Responses.Select(r => r.ShopId).Distinct().ToList();
            await realtimeNotifier.NotifyRequestExpiredAsync(req.CustomerId, shopIds, req.Id);
        }

        await context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Expired {Count} stale live request(s).", staleRequests.Count);
    }
}
