using Zooner.Api.Models;

namespace Zooner.Api.Services;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    RefreshToken GenerateRefreshToken(Guid userId, string? ipAddress = null);
    int GetAccessTokenExpiryMinutes();
}
