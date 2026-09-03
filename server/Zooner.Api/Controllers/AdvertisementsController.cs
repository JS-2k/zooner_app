using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services.Location;

namespace Zooner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdvertisementsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdvertisementsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieve targeted sponsored ads matching shopper's GPS location, preferred category, and time window (Premium Only)
    /// </summary>
    [HttpGet("targeted")]
    public async Task<IActionResult> GetTargetedAds(
        [FromQuery] double userLat = 11.0168,
        [FromQuery] double userLon = 76.9558,
        [FromQuery] string? category = "all")
    {
        var now = DateTime.UtcNow;

        // Fetch active ads within valid time window from active shops
        var adsQuery = _context.PremiumAdvertisements
            .Include(ad => ad.Shop)
            .Where(ad => ad.IsActive 
                         && ad.IsPremiumMerchantOnly 
                         && ad.StartTimeUtc <= now 
                         && ad.EndTimeUtc >= now);

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            adsQuery = adsQuery.Where(ad => ad.TargetCategory.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        var adsList = await adsQuery.ToListAsync();

        // Filter by location radius (Geo-distance calculation)
        var targetedAds = adsList
            .Select(ad =>
            {
                var distanceKm = GeoLocationHelper.CalculateDistanceKm(
                    userLat, userLon,
                    ad.Shop?.Latitude ?? userLat,
                    ad.Shop?.Longitude ?? userLon
                );

                var remainingSeconds = (int)(ad.EndTimeUtc - now).TotalSeconds;

                return new
                {
                    ad.Id,
                    ShopId = ad.ShopId,
                    ShopName = ad.Shop?.Name ?? "Verified Premium Retailer",
                    ShopAddress = ad.Shop?.Address ?? "Coimbatore",
                    ad.Title,
                    ad.Description,
                    ad.TargetCategory,
                    ad.OfferTag,
                    ad.ImageUrl,
                    DistanceKm = Math.Round(distanceKm, 2),
                    DistanceText = distanceKm < 1.0 ? $"{Math.Round(distanceKm * 1000)}m away" : $"{Math.Round(distanceKm, 1)} km away",
                    IsWithinRadius = distanceKm <= ad.TargetRadiusKm,
                    RemainingSeconds = Math.Max(0, remainingSeconds),
                    FormattedTimeLeft = $"{Math.Max(0, remainingSeconds / 3600):D2}h {Math.Max(0, (remainingSeconds % 3600) / 60):D2}m remaining",
                    IsPremiumSponsored = true
                };
            })
            .Where(ad => ad.IsWithinRadius)
            .OrderBy(ad => ad.DistanceKm)
            .ToList();

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Targeted premium advertisements retrieved successfully.",
            Data = targetedAds
        });
    }
}
