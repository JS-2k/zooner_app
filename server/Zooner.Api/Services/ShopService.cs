using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services.Location;

namespace Zooner.Api.Services;

public class ShopService : IShopService
{
    private readonly AppDbContext _context;
    private readonly ILogger<ShopService> _logger;

    public ShopService(AppDbContext context, ILogger<ShopService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ApiResponse<ShopDto>> CreateShopAsync(Guid ownerId, CreateShopRequest request)
    {
        var owner = await _context.Users.FindAsync(ownerId);
        if (owner == null)
        {
            return ApiResponse<ShopDto>.Fail("Owner user not found.");
        }

        // Validate categories
        if (request.CategoryIds.Any())
        {
            var validCount = await _context.Categories.CountAsync(c => request.CategoryIds.Contains(c.Id) && c.IsActive);
            if (validCount != request.CategoryIds.Distinct().Count())
            {
                return ApiResponse<ShopDto>.Fail("One or more specified categories are invalid or inactive.");
            }
        }

        var shop = new Shop
        {
            Id = Guid.NewGuid(),
            OwnerId = ownerId,
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            Phone = request.Phone.Trim(),
            Address = request.Address.Trim(),
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ImageUrl = request.ImageUrl,
            VerificationStatus = ShopVerificationStatus.Approved, // Auto-approve for dev/demo or default to Pending in strict mode
            IsActive = true,
            IsLiveEnabled = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        foreach (var catId in request.CategoryIds.Distinct())
        {
            shop.ShopCategories.Add(new ShopCategory { ShopId = shop.Id, CategoryId = catId });
        }

        // Default standard 7-day operating hours (9 AM - 9 PM)
        for (int day = 0; day < 7; day++)
        {
            shop.OperatingHours.Add(new ShopOperatingHour
            {
                Id = Guid.NewGuid(),
                ShopId = shop.Id,
                DayOfWeek = (DayOfWeek)day,
                OpenTime = new TimeSpan(9, 0, 0),
                CloseTime = new TimeSpan(21, 0, 0),
                IsClosed = false
            });
        }

        _context.Shops.Add(shop);
        await _context.SaveChangesAsync();

        return ApiResponse<ShopDto>.Ok((await LoadShopDtoAsync(shop.Id))!, "Shop registered successfully.");
    }

    public async Task<ApiResponse<ShopDto>> GetShopByIdAsync(Guid id, double? userLat = null, double? userLon = null)
    {
        var shopDto = await LoadShopDtoAsync(id, userLat, userLon);
        if (shopDto == null)
        {
            return ApiResponse<ShopDto>.Fail("Shop not found.");
        }

        return ApiResponse<ShopDto>.Ok(shopDto);
    }

    public async Task<ApiResponse<List<ShopDto>>> GetMyShopsAsync(Guid ownerId)
    {
        var shops = await _context.Shops
            .Where(s => s.OwnerId == ownerId)
            .OrderByDescending(s => s.CreatedAtUtc)
            .Include(s => s.Owner)
            .Include(s => s.ShopCategories).ThenInclude(sc => sc.Category)
            .Include(s => s.OperatingHours)
            .AsNoTracking()
            .ToListAsync();

        return ApiResponse<List<ShopDto>>.Ok(shops.Select(s => MapToShopDto(s)).ToList());
    }

    public async Task<ApiResponse<ShopDto>> UpdateShopAsync(Guid ownerId, Guid shopId, UpdateShopRequest request)
    {
        var shop = await _context.Shops
            .Include(s => s.Owner)
            .FirstOrDefaultAsync(s => s.Id == shopId);

        if (shop == null)
        {
            return ApiResponse<ShopDto>.Fail("Shop not found.");
        }

        if (shop.OwnerId != ownerId)
        {
            return ApiResponse<ShopDto>.Fail("You are not authorized to update this shop.");
        }

        shop.Name = request.Name.Trim();
        shop.Description = request.Description.Trim();
        shop.Phone = request.Phone.Trim();
        shop.Address = request.Address.Trim();
        shop.Latitude = request.Latitude;
        shop.Longitude = request.Longitude;
        shop.ImageUrl = request.ImageUrl;
        shop.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResponse<ShopDto>.Ok((await LoadShopDtoAsync(shop.Id))!, "Shop updated successfully.");
    }

    public async Task<ApiResponse> ToggleLiveStatusAsync(Guid ownerId, Guid shopId, bool isLiveEnabled)
    {
        var shop = await _context.Shops.FindAsync(shopId);
        if (shop == null)
        {
            return ApiResponse.Fail("Shop not found.");
        }

        if (shop.OwnerId != ownerId)
        {
            return ApiResponse.Fail("You do not own this shop.");
        }

        shop.IsLiveEnabled = isLiveEnabled;
        shop.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse.Ok($"Live request availability set to {(isLiveEnabled ? "ONLINE" : "OFFLINE")}.");
    }

    public async Task<ApiResponse> AssignCategoriesAsync(Guid ownerId, Guid shopId, List<Guid> categoryIds)
    {
        var shop = await _context.Shops
            .Include(s => s.ShopCategories)
            .FirstOrDefaultAsync(s => s.Id == shopId);

        if (shop == null)
        {
            return ApiResponse.Fail("Shop not found.");
        }

        if (shop.OwnerId != ownerId)
        {
            return ApiResponse.Fail("You do not own this shop.");
        }

        var validCategories = await _context.Categories
            .Where(c => categoryIds.Contains(c.Id) && c.IsActive)
            .Select(c => c.Id)
            .ToListAsync();

        _context.ShopCategories.RemoveRange(shop.ShopCategories);

        foreach (var catId in validCategories)
        {
            shop.ShopCategories.Add(new ShopCategory { ShopId = shop.Id, CategoryId = catId });
        }

        shop.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse.Ok("Categories updated for shop.");
    }

    public async Task<ApiResponse> RemoveCategoryAsync(Guid ownerId, Guid shopId, Guid categoryId)
    {
        var shop = await _context.Shops.FindAsync(shopId);
        if (shop == null) return ApiResponse.Fail("Shop not found.");
        if (shop.OwnerId != ownerId) return ApiResponse.Fail("Unauthorized.");

        var link = await _context.ShopCategories
            .FirstOrDefaultAsync(sc => sc.ShopId == shopId && sc.CategoryId == categoryId);

        if (link != null)
        {
            _context.ShopCategories.Remove(link);
            await _context.SaveChangesAsync();
        }

        return ApiResponse.Ok("Category removed from shop.");
    }

    public async Task<ApiResponse<List<ShopOperatingHourDto>>> GetOperatingHoursAsync(Guid shopId)
    {
        var hours = await _context.ShopOperatingHours
            .Where(h => h.ShopId == shopId)
            .OrderBy(h => h.DayOfWeek)
            .Select(h => new ShopOperatingHourDto
            {
                DayOfWeek = h.DayOfWeek,
                OpenTime = h.OpenTime,
                CloseTime = h.CloseTime,
                IsClosed = h.IsClosed
            })
            .ToListAsync();

        return ApiResponse<List<ShopOperatingHourDto>>.Ok(hours);
    }

    public async Task<ApiResponse> UpdateOperatingHoursAsync(Guid ownerId, Guid shopId, List<ShopOperatingHourDto> hours)
    {
        var shop = await _context.Shops
            .Include(s => s.OperatingHours)
            .FirstOrDefaultAsync(s => s.Id == shopId);

        if (shop == null) return ApiResponse.Fail("Shop not found.");
        if (shop.OwnerId != ownerId) return ApiResponse.Fail("Unauthorized.");

        _context.ShopOperatingHours.RemoveRange(shop.OperatingHours);

        foreach (var h in hours)
        {
            shop.OperatingHours.Add(new ShopOperatingHour
            {
                Id = Guid.NewGuid(),
                ShopId = shopId,
                DayOfWeek = h.DayOfWeek,
                OpenTime = h.OpenTime,
                CloseTime = h.CloseTime,
                IsClosed = h.IsClosed
            });
        }

        shop.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse.Ok("Operating hours updated successfully.");
    }

    public async Task<List<Shop>> FindNearbyEligibleShopsAsync(double latitude, double longitude, double radiusKm, Guid categoryId)
    {
        // 1. Calculate bounding box for index scanning
        var bbox = GeoLocationHelper.GetBoundingBox(latitude, longitude, radiusKm);

        // 2. Query shops within bounding box with matching category, active status, approved verification, and LIVE enabled
        var candidates = await _context.Shops
            .Where(s => s.IsActive 
                     && s.IsLiveEnabled 
                     && s.VerificationStatus == ShopVerificationStatus.Approved
                     && s.Latitude >= bbox.MinLat && s.Latitude <= bbox.MaxLat
                     && s.Longitude >= bbox.MinLon && s.Longitude <= bbox.MaxLon
                     && s.ShopCategories.Any(sc => sc.CategoryId == categoryId))
            .Include(s => s.OperatingHours)
            .AsNoTracking()
            .ToListAsync();

        // 3. Filter candidates by precise Haversine distance and current open status
        var now = DateTime.UtcNow;
        var currentDay = now.DayOfWeek;
        var currentTime = now.TimeOfDay;

        var eligibleShops = new List<Shop>();
        foreach (var shop in candidates)
        {
            var distance = GeoLocationHelper.CalculateDistanceKm(latitude, longitude, shop.Latitude, shop.Longitude);
            if (distance <= radiusKm)
            {
                // If today is marked as a closed day, skip; otherwise merchant is accepting live requests via IsLiveEnabled
                var todayHours = shop.OperatingHours.FirstOrDefault(h => h.DayOfWeek == currentDay);
                if (todayHours == null || !todayHours.IsClosed)
                {
                    eligibleShops.Add(shop);
                }
            }
        }

        return eligibleShops;
    }

    private async Task<ShopDto?> LoadShopDtoAsync(Guid shopId, double? userLat = null, double? userLon = null)
    {
        var shop = await _context.Shops
            .Include(s => s.Owner)
            .Include(s => s.ShopCategories).ThenInclude(sc => sc.Category)
            .Include(s => s.OperatingHours)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == shopId);

        return shop == null ? null : MapToShopDto(shop, userLat, userLon);
    }

    private static ShopDto MapToShopDto(Shop s, double? userLat = null, double? userLon = null)
    {
        var now = DateTime.UtcNow;
        var today = s.OperatingHours.FirstOrDefault(h => h.DayOfWeek == now.DayOfWeek);
        var isOpen = today != null && !today.IsClosed && now.TimeOfDay >= today.OpenTime && now.TimeOfDay <= today.CloseTime;

        double? distance = null;
        if (userLat.HasValue && userLon.HasValue)
        {
            distance = GeoLocationHelper.CalculateDistanceKm(userLat.Value, userLon.Value, s.Latitude, s.Longitude);
        }

        return new ShopDto
        {
            Id = s.Id,
            OwnerId = s.OwnerId,
            OwnerName = s.Owner?.FullName ?? string.Empty,
            Name = s.Name,
            Description = s.Description,
            Phone = s.Phone,
            Address = s.Address,
            Latitude = s.Latitude,
            Longitude = s.Longitude,
            ImageUrl = s.ImageUrl,
            VerificationStatus = s.VerificationStatus.ToString(),
            IsActive = s.IsActive,
            IsLiveEnabled = s.IsLiveEnabled,
            IsCurrentlyOpen = isOpen,
            DistanceKm = distance,
            Categories = s.ShopCategories.Select(sc => new ShopCategorySummaryDto
            {
                CategoryId = sc.CategoryId,
                Name = sc.Category?.Name ?? string.Empty,
                Slug = sc.Category?.Slug ?? string.Empty,
                Icon = sc.Category?.Icon ?? string.Empty
            }).ToList(),
            OperatingHours = s.OperatingHours.Select(h => new ShopOperatingHourDto
            {
                DayOfWeek = h.DayOfWeek,
                OpenTime = h.OpenTime,
                CloseTime = h.CloseTime,
                IsClosed = h.IsClosed
            }).ToList(),
            CreatedAtUtc = s.CreatedAtUtc
        };
    }
}
