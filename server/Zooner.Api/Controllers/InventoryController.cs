using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    /// Reserve 30-minute customer hold (decrements AvailableQuantity)
    /// </summary>
    [HttpPost("{inventoryId:guid}/hold")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ReserveHold(
        Guid storeId,
        Guid inventoryId,
        [FromQuery] int quantity = 1)
    {
        var response = await _inventoryService.ReserveInventoryHoldAsync(inventoryId, quantity);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Release 30-minute customer hold (restores AvailableQuantity)
    /// </summary>
    [HttpPost("{inventoryId:guid}/release-hold")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ReleaseHold(
        Guid storeId,
        Guid inventoryId,
        [FromQuery] int quantity = 1)
    {
        var response = await _inventoryService.ReleaseInventoryHoldAsync(inventoryId, quantity);
        return response.Success ? Ok(response) : BadRequest(response);
    }
}
