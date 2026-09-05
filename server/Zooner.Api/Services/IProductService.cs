using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface IProductService
{
    Task<ApiResponse<List<ProductSearchResultDto>>> SearchProductsAsync(
        string? query,
        string? categorySlug,
        double? userLat,
        double? userLon,
        int page = 1,
        int pageSize = 20
    );

    Task<ApiResponse<ProductSearchResultDto>> GetProductByIdAsync(
        Guid productId,
        double? userLat,
        double? userLon
    );

    Task<ApiResponse<List<StoreInventoryDetailDto>>> GetProductStoresAsync(
        Guid productId,
        double? userLat,
        double? userLon
    );

    Task<ApiResponse<DuplicateCheckResultDto>> CheckDuplicateProductAsync(
        string? gtin,
        string? brandName,
        string? modelNumber,
        string? name
    );

    Task<ApiResponse<ProductSearchResultDto>> CreateGlobalProductAsync(
        CreateProductRequest request
    );
}
