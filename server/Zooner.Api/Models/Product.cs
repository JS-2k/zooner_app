using System.ComponentModel.DataAnnotations;

namespace Zooner.Api.Models;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? BrandId { get; set; }
    public Brand? Brand { get; set; }

    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string NormalizedName { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? ModelNumber { get; set; }

    [MaxLength(100)]
    public string? GTIN { get; set; } // EAN / UPC Barcode

    [MaxLength(100)]
    public string? MPN { get; set; } // Manufacturer Part Number

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }

    // Navigation properties
    public List<ProductVariant> Variants { get; set; } = new();
}
