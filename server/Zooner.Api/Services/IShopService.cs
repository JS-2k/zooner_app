using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface IShopService
{
    Task<ApiResponse<ShopDto>> CreateShopAsync(Guid ownerId, CreateShopRequest request);
    Task<ApiResponse<ShopDto>> GetShopByIdAsync(Guid id, double? userLat = null, double? userLon = null);
    Task<ApiResponse<List<ShopDto>>> GetMyShopsAsync(Guid ownerId);
    Task<ApiResponse<ShopDto>> UpdateShopAsync(Guid ownerId, Guid shopId, UpdateShopRequest request);
    Task<ApiResponse> ToggleLiveStatusAsync(Guid ownerId, Guid shopId, bool isLiveEnabled);
    Task<ApiResponse> AssignCategoriesAsync(Guid ownerId, Guid shopId, List<Guid> categoryIds);
    Task<ApiResponse> RemoveCategoryAsync(Guid ownerId, Guid shopId, Guid categoryId);
    Task<ApiResponse<List<ShopOperatingHourDto>>> GetOperatingHoursAsync(Guid shopId);
    Task<ApiResponse> UpdateOperatingHoursAsync(Guid ownerId, Guid shopId, List<ShopOperatingHourDto> hours);
    Task<List<Shop>> FindNearbyEligibleShopsAsync(double latitude, double longitude, double radiusKm, Guid categoryId);
}
