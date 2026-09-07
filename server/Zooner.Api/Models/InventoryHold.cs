using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public enum InventoryHoldStatus
{
    Active = 0,
    Released = 1,
    Fulfilled = 2,
    Expired = 3
}

public class InventoryHold
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StoreInventoryId { get; set; }

    [JsonIgnore]
    public StoreInventory? StoreInventory { get; set; }

    public Guid StoreId { get; set; }

    [JsonIgnore]
    public Shop? Store { get; set; }

    public Guid CustomerId { get; set; }

    [JsonIgnore]
    public User? Customer { get; set; }

    [Range(1, 5)]
    public int Quantity { get; set; } = 1;

    [MaxLength(20)]
    public string HoldCode { get; set; } = string.Empty;

    [MaxLength(128)]
    public string QrToken { get; set; } = string.Empty;

    public InventoryHoldStatus Status { get; set; } = InventoryHoldStatus.Active;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? ReleasedAtUtc { get; set; }
}
