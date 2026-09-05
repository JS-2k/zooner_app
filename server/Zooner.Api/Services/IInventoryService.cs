using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface IInventoryService
{
    Task<ApiResponse<List<StoreInventoryDetailDto>>> GetStoreInventoryAsync(
        Guid storeId,
        string? search,
        Guid? categoryId
    );

    Task<ApiResponse<StoreInventoryDetailDto>> AddStoreInventoryAsync(
        Guid storeId,
        Guid ownerUserId,
        AddStoreInventoryRequest request
    );

    Task<ApiResponse<StoreInventoryDetailDto>> UpdateStoreInventoryAsync(
        Guid storeId,
        Guid inventoryId,
        Guid ownerUserId,
        UpdateStoreInventoryRequest request
    );

    Task<ApiResponse<bool>> DeleteStoreInventoryAsync(
        Guid storeId,
        Guid inventoryId,
        Guid ownerUserId
    );

    Task<ApiResponse<bool>> ReserveInventoryHoldAsync(
        Guid inventoryId,
        int quantityToHold = 1
    );

    Task<ApiResponse<bool>> ReleaseInventoryHoldAsync(
        Guid inventoryId,
        int quantityToRelease = 1
    );
}
