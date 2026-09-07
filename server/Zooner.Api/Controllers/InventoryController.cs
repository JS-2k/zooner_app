using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;


namespace Zooner.Api.Controllers;

[ApiController]
[Route("api/stores/{storeId:guid}/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    /// <summary>
    /// Retrieve inventory items for a specific store
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<StoreInventoryDetailDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStoreInventory(
        Guid storeId,
        [FromQuery] string? search,
        [FromQuery] Guid? categoryId)
    {
        var response = await _inventoryService.GetStoreInventoryAsync(storeId, search, categoryId);
        return Ok(response);
    }

    /// <summary>
    /// Add an existing global product variant to a store's inventory
    /// Authorized: Authenticated vendor must own the store
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<StoreInventoryDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<StoreInventoryDetailDto>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddInventory(
        Guid storeId,
        [FromBody] AddStoreInventoryRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Unauthorized user context."));
        }

        var response = await _inventoryService.AddStoreInventoryAsync(storeId, userId, request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Update store inventory details (price, quantity, shelf location)
    /// Authorized: Authenticated vendor must own the store
    /// </summary>
    [HttpPut("{inventoryId:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<StoreInventoryDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateInventory(
        Guid storeId,
        Guid inventoryId,
        [FromBody] UpdateStoreInventoryRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Unauthorized user context."));
        }

        var response = await _inventoryService.UpdateStoreInventoryAsync(storeId, inventoryId, userId, request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Deactivate/remove an item from store inventory
    /// Authorized: Authenticated vendor must own the store
    /// </summary>
    [HttpDelete("{inventoryId:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteInventory(
        Guid storeId,
        Guid inventoryId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<bool>.ErrorResponse("Unauthorized user context."));
        }

        var response = await _inventoryService.DeleteStoreInventoryAsync(storeId, inventoryId, userId);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Reserve 30-minute customer hold pass (Requires authentication)
    /// </summary>
    [HttpPost("{inventoryId:guid}/hold")]
    [Authorize]
    [EnableRateLimiting("hold-limit")]
    [ProducesResponseType(typeof(ApiResponse<InventoryHoldDto>), StatusCodes.Status200OK)]

    [ProducesResponseType(typeof(ApiResponse<InventoryHoldDto>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<InventoryHoldDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ReserveHold(
        Guid storeId,
        Guid inventoryId,
        [FromBody] CreateHoldRequest? request = null)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var customerId))
        {
            return Unauthorized(ApiResponse<InventoryHoldDto>.ErrorResponse("Authentication required to reserve hold pass."));
        }

        var quantity = request?.Quantity ?? 1;
        var response = await _inventoryService.ReserveInventoryHoldAsync(storeId, inventoryId, customerId, quantity);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Release customer hold pass (Authorized: Hold owner, Store owner, or Admin)
    /// </summary>
    [HttpPost("{inventoryId:guid}/holds/{holdId:guid}/release")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ReleaseHold(
        Guid storeId,
        Guid inventoryId,
        Guid holdId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<bool>.ErrorResponse("Authentication required."));
        }

        var response = await _inventoryService.ReleaseInventoryHoldAsync(storeId, inventoryId, holdId, userId);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Retrieve all active holds for the current authenticated customer
    /// </summary>
    [HttpGet("~/api/holds/my-holds")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<InventoryHoldDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<List<InventoryHoldDto>>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyHolds()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var customerId))
        {
            return Unauthorized(ApiResponse<List<InventoryHoldDto>>.ErrorResponse("Authentication required."));
        }

        var response = await _inventoryService.GetActiveHoldsForCustomerAsync(customerId);
        return Ok(response);
    }
}


