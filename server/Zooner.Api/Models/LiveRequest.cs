using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class LiveRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid CustomerId { get; set; }

    [JsonIgnore]
    public User? Customer { get; set; }

    [Required]
    [MaxLength(500)]
    public string RequestText { get; set; } = string.Empty;

    [Required]
    public Guid CategoryId { get; set; }

    [JsonIgnore]
    public Category? Category { get; set; }

    public Guid? SubCategoryId { get; set; }

    [JsonIgnore]
    public SubCategory? SubCategory { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public double SearchRadiusKm { get; set; } = 5.0;

    public LiveRequestStatus Status { get; set; } = LiveRequestStatus.Active;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAtUtc { get; set; } = DateTime.UtcNow.AddMinutes(30);

    public DateTime? FulfilledAtUtc { get; set; }

    public DateTime? CancelledAtUtc { get; set; }

    public Guid? SelectedShopId { get; set; }

    [JsonIgnore]
    public Shop? SelectedShop { get; set; }

    // Navigation properties
    public List<ShopResponse> Responses { get; set; } = new();
    public List<Conversation> Conversations { get; set; } = new();
}
