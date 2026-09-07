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

    public async Task<GoogleValidationResult> ValidateAsync(string credential)
    {
        if (string.IsNullOrWhiteSpace(credential))
        {
            return GoogleValidationResult.Fail("Google credential token is missing or empty.");
        }

        try
        {
            var clientId = _configuration["Google:ClientId"] 
                ?? _configuration["Google__ClientId"]
                ?? _configuration["Authentication:Google:ClientId"]
                ?? _configuration["GOOGLE_CLIENT_ID"]
                ?? _configuration["VITE_GOOGLE_CLIENT_ID"]
                ?? Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
                ?? Environment.GetEnvironmentVariable("Google__ClientId")
                ?? Environment.GetEnvironmentVariable("VITE_GOOGLE_CLIENT_ID");

            var settings = new GoogleJsonWebSignature.ValidationSettings();

            if (!string.IsNullOrWhiteSpace(clientId))
            {
                var trimmedId = clientId.Trim();
                settings.Audience = new[] { trimmedId };
                _logger.LogInformation("Validating Google ID token against Audience: {Audience}", trimmedId);
            }
            else
            {
                _logger.LogWarning("Google Client ID is not configured on the backend server. Configure GOOGLE_CLIENT_ID in server environment variables.");
            }

            var payload = await GoogleJsonWebSignature.ValidateAsync(credential, settings);

            if (payload == null || string.IsNullOrWhiteSpace(payload.Subject) || string.IsNullOrWhiteSpace(payload.Email))
            {
                _logger.LogWarning("Google token validation returned payload missing Subject or Email.");
                return GoogleValidationResult.Fail("Google authentication token is missing required identity claims.");
            }

            _logger.LogInformation("Google token validation successful for user {Email}, email verified: {Verified}", 
                payload.Email, payload.EmailVerified);

            return GoogleValidationResult.Success(new GoogleTokenPayload
            {
                Subject = payload.Subject,
                Email = payload.Email.Trim().ToLowerInvariant(),
                EmailVerified = payload.EmailVerified,
                Name = payload.Name,
                GivenName = payload.GivenName,
                FamilyName = payload.FamilyName,
                Picture = payload.Picture
            });
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning("Google ID token validation failed: {Message}", ex.Message);

            var lowerMsg = ex.Message.ToLowerInvariant();
            if (lowerMsg.Contains("audience") || lowerMsg.Contains("aud"))
            {
                return GoogleValidationResult.Fail("Google token audience mismatch. Verify that GOOGLE_CLIENT_ID on Render matches VITE_GOOGLE_CLIENT_ID on Vercel.");
            }
            if (lowerMsg.Contains("expired") || lowerMsg.Contains("exp"))
            {
                return GoogleValidationResult.Fail("Google authentication token has expired. Please sign in again.");
            }
            if (lowerMsg.Contains("issuer") || lowerMsg.Contains("iss"))
            {
                return GoogleValidationResult.Fail("Google token issuer is invalid.");
            }
            if (lowerMsg.Contains("signature") || lowerMsg.Contains("crypto"))
            {
                return GoogleValidationResult.Fail("Google token signature verification failed.");
            }

            return GoogleValidationResult.Fail($"Google authentication token validation failed: {ex.Message}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error validating Google ID token.");
            return GoogleValidationResult.Fail("An unexpected error occurred while validating Google authentication credentials.");
        }
    }
}
