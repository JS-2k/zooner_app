using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class PremiumAdvertisement
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ShopId { get; set; }

    [JsonIgnore]
    public Shop? Shop { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string TargetCategory { get; set; } = string.Empty; // e.g. "running-shoes", "fashion"

    public double TargetRadiusKm { get; set; } = 5.0; // Geo-targeting radius from shop coordinates

    public DateTime StartTimeUtc { get; set; } = DateTime.UtcNow;

    public DateTime EndTimeUtc { get; set; } = DateTime.UtcNow.AddHours(4); // Timed expiration

    [MaxLength(50)]
    public string OfferTag { get; set; } = "FLASH DEAL"; // e.g. "25% OFF IN-STORE"

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsPremiumMerchantOnly { get; set; } = true; // Premium plan validation

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
