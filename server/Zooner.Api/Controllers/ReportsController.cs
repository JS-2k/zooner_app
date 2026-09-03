using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IAdminService _adminService;

    public ReportsController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    /// <summary>
    /// Submit a report regarding a shop, user, or live request
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ReportDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ReportDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitReport([FromBody] CreateReportRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _adminService.CreateReportAsync(userId, request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.Parse(claim!);
    }
}
