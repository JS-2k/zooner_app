using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface IAuthService
{
    Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request, string? ipAddress = null);
    Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request, string? ipAddress = null);
    Task<ApiResponse<AuthResponse>> RefreshTokenAsync(string token, string? ipAddress = null);
    Task<ApiResponse> RevokeTokenAsync(string token, string? ipAddress = null);
    Task<ApiResponse<UserDto>> GetCurrentUserAsync(Guid userId);
}
