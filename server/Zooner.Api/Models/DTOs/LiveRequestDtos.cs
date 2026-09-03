using System.ComponentModel.DataAnnotations;

namespace Zooner.Api.Models.DTOs;

public class CreateLiveRequest
{
    [Required]
    [MaxLength(500)]
    public string RequestText { get; set; } = string.Empty;

    [Required]
    public Guid CategoryId { get; set; }

    public Guid? SubCategoryId { get; set; }

    [Range(-90.0, 90.0)]
    public double Latitude { get; set; }

    [Range(-180.0, 180.0)]
    public double Longitude { get; set; }

    [Range(0.5, 50.0, ErrorMessage = "Search radius must be between 0.5 km and 50 km.")]
    public double SearchRadiusKm { get; set; } = 5.0;
}

public class ShopResponseDto
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public string ShopPhone { get; set; } = string.Empty;
    public string ShopAddress { get; set; } = string.Empty;
    public double ShopLatitude { get; set; }
    public double ShopLongitude { get; set; }
    public double? DistanceKm { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime CreatedAtUtc { get; set; }
}

public class LiveRequestSummaryDto
{
    public Guid Id { get; set; }
    public string RequestText { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? SubCategoryName { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double SearchRadiusKm { get; set; }
    public double? DistanceToShopKm { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
}

public class LiveRequestDto
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string RequestText { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public Guid? SubCategoryId { get; set; }
    public string? SubCategoryName { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double SearchRadiusKm { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
    public DateTime? FulfilledAtUtc { get; set; }
    public DateTime? CancelledAtUtc { get; set; }
    public Guid? SelectedShopId { get; set; }
    public string? SelectedShopName { get; set; }
    public List<ShopResponseDto> Responses { get; set; } = new();
}

public class RespondToLiveRequest
{
    [Required]
    public Guid ShopId { get; set; }
}

public class SelectShopRequest
{
    [Required]
    public Guid ShopId { get; set; }
}

public class ShopAvailableNotificationDto
{
    public Guid LiveRequestId { get; set; }
    public Guid ShopId { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public string ShopAddress { get; set; } = string.Empty;
    public double DistanceKm { get; set; }
    public DateTime RespondedAtUtc { get; set; }
}
