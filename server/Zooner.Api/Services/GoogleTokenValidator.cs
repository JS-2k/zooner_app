using Google.Apis.Auth;
using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public class GoogleTokenValidator : IGoogleTokenValidator
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<GoogleTokenValidator> _logger;

    public GoogleTokenValidator(IConfiguration configuration, ILogger<GoogleTokenValidator> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<GoogleTokenPayload?> ValidateAsync(string credential)
    {
        if (string.IsNullOrWhiteSpace(credential))
        {
            return null;
        }

        try
        {
            var clientId = _configuration["Google:ClientId"] 
                ?? _configuration["Google__ClientId"]
                ?? _configuration["Authentication:Google:ClientId"];

            var settings = new GoogleJsonWebSignature.ValidationSettings();

            if (!string.IsNullOrWhiteSpace(clientId))
            {
                settings.Audience = new[] { clientId.Trim() };
            }

            var payload = await GoogleJsonWebSignature.ValidateAsync(credential, settings);

            if (payload == null || string.IsNullOrWhiteSpace(payload.Subject) || string.IsNullOrWhiteSpace(payload.Email))
            {
                _logger.LogWarning("Google token validation returned payload missing Subject or Email.");
                return null;
            }

            return new GoogleTokenPayload
            {
                Subject = payload.Subject,
                Email = payload.Email.Trim().ToLowerInvariant(),
                EmailVerified = payload.EmailVerified,
                Name = payload.Name,
                GivenName = payload.GivenName,
                FamilyName = payload.FamilyName,
                Picture = payload.Picture
            };
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning("Google ID token validation failed: {Message}", ex.Message);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error validating Google ID token.");
            return null;
        }
    }
}
