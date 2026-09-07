using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models;

namespace Zooner.Api.Services.Background;

public class HoldExpirationWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<HoldExpirationWorker> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(60);

    public HoldExpirationWorker(IServiceProvider serviceProvider, ILogger<HoldExpirationWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("HoldExpirationWorker background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpireOutdatedHoldsAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error occurred while expiring outdated inventory holds.");
            }

            try
            {
                await Task.Delay(_checkInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
        }

        _logger.LogInformation("HoldExpirationWorker background service stopping.");
    }

    public async Task<int> ExpireOutdatedHoldsAsync(CancellationToken cancellationToken = default)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;

        var expiredHolds = await context.InventoryHolds
            .Include(h => h.StoreInventory)
            .Where(h => h.Status == InventoryHoldStatus.Active && h.ExpiresAtUtc <= now)
            .ToListAsync(cancellationToken);

        if (!expiredHolds.Any())
        {
            return 0;
        }

        foreach (var hold in expiredHolds)
        {
            hold.Status = InventoryHoldStatus.Expired;
            if (hold.StoreInventory != null)
            {
                hold.StoreInventory.AvailableQuantity = Math.Min(
                    hold.StoreInventory.Quantity,
                    hold.StoreInventory.AvailableQuantity + hold.Quantity
                );
                hold.StoreInventory.UpdatedAtUtc = now;
            }
        }

        await context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("HoldExpirationWorker expired {Count} outdated hold(s) and restored available inventory.", expiredHolds.Count);
        return expiredHolds.Count;
    }
}
