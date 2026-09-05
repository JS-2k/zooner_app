using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class ShopResponse
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid LiveRequestId { get; set; }

    [JsonIgnore]
    public LiveRequest? LiveRequest { get; set; }

    [Required]
    public Guid ShopId { get; set; }

    [JsonIgnore]
    public Shop? Shop { get; set; }

    public ShopResponseStatus Status { get; set; } = ShopResponseStatus.Available;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }
}
