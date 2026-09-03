using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface ILiveRequestService
{
    Task<ApiResponse<LiveRequestDto>> CreateRequestAsync(Guid customerId, CreateLiveRequest request);
    Task<ApiResponse<LiveRequestDto>> GetRequestByIdAsync(Guid requestId, Guid userId);
    Task<ApiResponse<List<LiveRequestSummaryDto>>> GetMyRequestsAsync(Guid customerId);
    Task<ApiResponse<List<LiveRequestSummaryDto>>> GetIncomingRequestsForShopAsync(Guid ownerId, Guid shopId);
    Task<ApiResponse<ShopResponseDto>> RespondAvailableAsync(Guid ownerId, Guid requestId, Guid shopId);
    Task<ApiResponse> CancelRequestAsync(Guid customerId, Guid requestId);
    Task<ApiResponse<LiveRequestDto>> SelectShopAsync(Guid customerId, Guid requestId, Guid shopId);
    Task<ApiResponse> FulfillRequestAsync(Guid customerId, Guid requestId);
}
