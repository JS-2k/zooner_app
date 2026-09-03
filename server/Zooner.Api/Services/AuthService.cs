using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(AppDbContext context, ITokenService tokenService, ILogger<AuthService> logger)
    {
        _context = context;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request, string? ipAddress = null)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        if (existingUser)
        {
            return ApiResponse<AuthResponse>.Fail("An account with this email address already exists.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var validRoles = new[] { "Customer", "Retailer", "Admin" };
        var role = validRoles.Contains(request.Role, StringComparer.OrdinalIgnoreCase) 
            ? request.Role 
            : "Customer";

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            Role = role,
            CreatedAtUtc = DateTime.UtcNow
        };

        var refreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);

        _context.Users.Add(user);
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user);

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresInMinutes = _tokenService.GetAccessTokenExpiryMinutes(),
            User = MapToUserDto(user)
        }, "Registration successful.");
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request, string? ipAddress = null)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return ApiResponse<AuthResponse>.Fail("Invalid email or password.");
        }

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresInMinutes = _tokenService.GetAccessTokenExpiryMinutes(),
            User = MapToUserDto(user)
        }, "Login successful.");
    }

    public async Task<ApiResponse<AuthResponse>> RefreshTokenAsync(string token, string? ipAddress = null)
    {
        var refreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken == null)
        {
            return ApiResponse<AuthResponse>.Fail("Invalid refresh token.");
        }

        if (refreshToken.IsRevoked)
        {
            _logger.LogWarning("Revoked refresh token reuse detected for User ID {UserId}", refreshToken.UserId);
            var activeTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == refreshToken.UserId && rt.RevokedAtUtc == null)
                .ToListAsync();

            foreach (var t in activeTokens)
            {
                t.RevokedAtUtc = DateTime.UtcNow;
                t.RevokedByIp = ipAddress;
            }
            await _context.SaveChangesAsync();

            return ApiResponse<AuthResponse>.Fail("Invalid refresh token. Session terminated for security.");
        }

        if (refreshToken.IsExpired)
        {
            return ApiResponse<AuthResponse>.Fail("Refresh token has expired. Please sign in again.");
        }

        var user = refreshToken.User;
        if (user == null)
        {
            return ApiResponse<AuthResponse>.Fail("Associated user not found.");
        }

        // Token rotation: revoke current token and create replacement
        var newRefreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);
        refreshToken.RevokedAtUtc = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        refreshToken.ReplacedByToken = newRefreshToken.Token;

        _context.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync();

        var newAccessToken = _tokenService.GenerateAccessToken(user);

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken.Token,
            ExpiresInMinutes = _tokenService.GetAccessTokenExpiryMinutes(),
            User = MapToUserDto(user)
        }, "Token refreshed successfully.");
    }

    public async Task<ApiResponse> RevokeTokenAsync(string token, string? ipAddress = null)
    {
        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token);

        if (refreshToken == null)
        {
            return ApiResponse.Fail("Token not found.");
        }

        if (!refreshToken.IsActive)
        {
            return ApiResponse.Fail("Token is already inactive or revoked.");
        }

        refreshToken.RevokedAtUtc = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;

        await _context.SaveChangesAsync();
        return ApiResponse.Ok("Token revoked successfully.");
    }

    public async Task<ApiResponse<UserDto>> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return ApiResponse<UserDto>.Fail("User not found.");
        }

        return ApiResponse<UserDto>.Ok(MapToUserDto(user));
    }

    private static UserDto MapToUserDto(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role,
        CreatedAtUtc = user.CreatedAtUtc
    };
}
