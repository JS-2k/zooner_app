using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class ProductVariant
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProductId { get; set; }

    [JsonIgnore]
    public Product? Product { get; set; }

    [Required]
    [MaxLength(100)]
    public string VariantName { get; set; } = "Default";

    [MaxLength(50)]
    public string? Color { get; set; }

    [MaxLength(50)]
    public string? Size { get; set; }

    [MaxLength(50)]
    public string? Storage { get; set; }

    [MaxLength(100)]
    public string? GTIN { get; set; }

    [MaxLength(100)]
    public string? SKU { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }

    // Navigation properties
    public List<StoreInventory> Inventories { get; set; } = new();
}
