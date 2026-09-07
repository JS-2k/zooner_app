using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface IGoogleTokenValidator
{
    Task<GoogleValidationResult> ValidateAsync(string credential);
}
