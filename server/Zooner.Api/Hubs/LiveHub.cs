using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;

namespace Zooner.Api.Hubs;

[Authorize]
public class LiveHub : Hub
{
    private readonly AppDbContext _context;
    private readonly ILogger<LiveHub> _logger;

    public LiveHub(AppDbContext context, ILogger<LiveHub> logger)
    {
        _context = context;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId != null)
        {
            // Add user to their personal notification group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

            // If user owns shops, add them to their shop groups automatically
            var shopIds = await _context.Shops
                .Where(s => s.OwnerId == userId.Value && s.IsActive)
                .Select(s => s.Id)
                .ToListAsync();

            foreach (var shopId in shopIds)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"shop_{shopId}");
            }

            _logger.LogInformation("Client connected: User {UserId} added to user and shop groups.", userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId != null)
        {
            _logger.LogInformation("Client disconnected: User {UserId}.", userId);
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinLiveRequestGroup(string requestId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"request_{requestId}");
    }

    public async Task LeaveLiveRequestGroup(string requestId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"request_{requestId}");
    }

    private Guid? GetUserId()
    {
        var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.FindFirst("sub")?.Value;

        return Guid.TryParse(claim, out var userId) ? userId : null;
    }
}
