using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShopsController : ControllerBase
{
    private readonly IShopService _shopService;
    private readonly ILiveRequestService _liveRequestService;

    public ShopsController(IShopService shopService, ILiveRequestService liveRequestService)
    {
        _shopService = shopService;
        _liveRequestService = liveRequestService;
    }

    /// <summary>
    /// Register a new shop (Requires ShopOwner or Admin role)
    /// </summary>
    [Authorize(Roles = "ShopOwner,Admin,Customer")]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ShopDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ShopDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateShop([FromBody] CreateShopRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _shopService.CreateShopAsync(userId, request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Retrieve shop details by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ShopDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ShopDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetShopById(Guid id, [FromQuery] double? userLat = null, [FromQuery] double? userLon = null)
    {
        var response = await _shopService.GetShopByIdAsync(id, userLat, userLon);
        return response.Success ? Ok(response) : NotFound(response);
    }

    /// <summary>
    /// Retrieve all shops owned by current authenticated user
    /// </summary>
    [Authorize]
    [HttpGet("my-shops")]
    [ProducesResponseType(typeof(ApiResponse<List<ShopDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyShops()
    {
        var userId = GetCurrentUserId();
        var response = await _shopService.GetMyShopsAsync(userId);
        return Ok(response);
    }

    /// <summary>
    /// Update shop profile (Owner only)
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ShopDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ShopDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateShop(Guid id, [FromBody] UpdateShopRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _shopService.UpdateShopAsync(userId, id, request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Toggle Shop LIVE availability online/offline (Owner only)
    /// </summary>
    [Authorize]
    [HttpPatch("{id:guid}/live-status")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> ToggleLiveStatus(Guid id, [FromBody] ToggleLiveStatusRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _shopService.ToggleLiveStatusAsync(userId, id, request.IsLiveEnabled);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Assign product categories to shop (Owner only)
    /// </summary>
    [Authorize]
    [HttpPost("{id:guid}/categories")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> AssignCategories(Guid id, [FromBody] AssignCategoriesRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _shopService.AssignCategoriesAsync(userId, id, request.CategoryIds);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Remove a category from shop (Owner only)
    /// </summary>
    [Authorize]
    [HttpDelete("{id:guid}/categories/{categoryId:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> RemoveCategory(Guid id, Guid categoryId)
    {
        var userId = GetCurrentUserId();
        var response = await _shopService.RemoveCategoryAsync(userId, id, categoryId);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Retrieve operating hours for shop
    /// </summary>
    [HttpGet("{id:guid}/operating-hours")]
    [ProducesResponseType(typeof(ApiResponse<List<ShopOperatingHourDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOperatingHours(Guid id)
    {
        var response = await _shopService.GetOperatingHoursAsync(id);
        return Ok(response);
    }

    /// <summary>
    /// Update operating hours for shop (Owner only)
    /// </summary>
    [Authorize]
    [HttpPut("{id:guid}/operating-hours")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateOperatingHours(Guid id, [FromBody] UpdateOperatingHoursRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _shopService.UpdateOperatingHoursAsync(userId, id, request.OperatingHours);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Retrieve incoming live requests matching this shop's location and categories (Owner only)
    /// </summary>
    [Authorize]
    [HttpGet("{id:guid}/incoming-requests")]
    [ProducesResponseType(typeof(ApiResponse<List<LiveRequestSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIncomingRequests(Guid id)
    {
        var userId = GetCurrentUserId();
        var response = await _liveRequestService.GetIncomingRequestsForShopAsync(userId, id);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.Parse(claim!);
    }
}
