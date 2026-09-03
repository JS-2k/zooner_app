using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user (Customer or Retailer)
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<AuthResponse>.Fail("Validation failed", errors));
        }

        var ipAddress = GetClientIpAddress();
        var response = await _authService.RegisterAsync(request, ipAddress);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        SetRefreshTokenCookie(response.Data!.RefreshToken);
        return Ok(response);
    }

    /// <summary>
    /// Authenticate user credentials and return JWT Access Token and Refresh Token
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ApiResponse<AuthResponse>.Fail("Validation failed", errors));
        }

        var ipAddress = GetClientIpAddress();
        var response = await _authService.LoginAsync(request, ipAddress);

        if (!response.Success)
        {
            return Unauthorized(response);
        }

        SetRefreshTokenCookie(response.Data!.RefreshToken);
        return Ok(response);
    }

    /// <summary>
    /// Sign out by revoking the active refresh token and clearing authentication cookies
    /// </summary>
    [HttpPost("logout")]
    [HttpPost("signout")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout([FromBody] RevokeTokenRequest? request = null)
    {
        // Token can be sent in request body or retrieved from HttpOnly cookie
        var token = request?.RefreshToken ?? Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(token))
        {
            var ipAddress = GetClientIpAddress();
            await _authService.RevokeTokenAsync(token, ipAddress);
        }

        // Clear refresh token cookie
        Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None
        });

        return Ok(ApiResponse.Ok("Successfully signed out."));
    }

    /// <summary>
    /// Refresh an expired JWT access token using a valid refresh token
    /// </summary>
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest? request = null)
    {
        var token = request?.RefreshToken ?? Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Refresh token is required."));
        }

        var ipAddress = GetClientIpAddress();
        var response = await _authService.RefreshTokenAsync(token, ipAddress);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        SetRefreshTokenCookie(response.Data!.RefreshToken);
        return Ok(response);
    }

    /// <summary>
    /// Get the profile of the currently authenticated user (Requires valid JWT Bearer token)
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) 
            ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<UserDto>.Fail("User is not authenticated."));
        }

        var response = await _authService.GetCurrentUserAsync(userId);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    private void SetRefreshTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            Secure = true,
            SameSite = SameSiteMode.None
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string? GetClientIpAddress()
    {
        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            return forwardedFor.FirstOrDefault()?.Split(',')[0].Trim();
        }
        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
