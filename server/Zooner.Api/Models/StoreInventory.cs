using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class StoreInventory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StoreId { get; set; }

    [JsonIgnore]
    public Shop? Store { get; set; }

    public Guid ProductVariantId { get; set; }

    [JsonIgnore]
    public ProductVariant? ProductVariant { get; set; }

    [MaxLength(100)]
    public string? SKU { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public int AvailableQuantity { get; set; }

    [MaxLength(100)]
    public string? ShelfLocation { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
