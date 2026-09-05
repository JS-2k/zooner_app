using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class Shop
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid OwnerId { get; set; }

    [JsonIgnore]
    public User? Owner { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public ShopVerificationStatus VerificationStatus { get; set; } = ShopVerificationStatus.Pending;

    public bool IsActive { get; set; } = true;

    // Independent toggle: a shop may be physically open but temporarily offline for LocalLive requests
    public bool IsLiveEnabled { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }

    // Navigation properties
    public List<ShopCategory> ShopCategories { get; set; } = new();
    public List<ShopOperatingHour> OperatingHours { get; set; } = new();
    public List<ShopResponse> Responses { get; set; } = new();
    public List<Conversation> Conversations { get; set; } = new();
}
