using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface IGoogleTokenValidator
{
    Task<GoogleTokenPayload?> ValidateAsync(string credential);
}
