using System.ComponentModel.DataAnnotations;

namespace Zooner.Api.Models.DTOs;

public class BrandSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
}

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string VariantName { get; set; } = string.Empty;
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string? Storage { get; set; }
    public string? GTIN { get; set; }
    public string? SKU { get; set; }
}

public class StoreInventoryDetailDto
{
    public Guid InventoryId { get; set; }
    public Guid StoreId { get; set; }
    public string StoreName { get; set; } = string.Empty;
    public string StoreAddress { get; set; } = string.Empty;
    public string StorePhone { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double? DistanceKm { get; set; }
    public bool IsStoreOpen { get; set; }
    public Guid VariantId { get; set; }
    public string VariantName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public int AvailableQuantity { get; set; }
    public string? ShelfLocation { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}

public class ProductSearchResultDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? BrandName { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? ModelNumber { get; set; }
    public string? GTIN { get; set; }
    public string? MPN { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public int TotalAvailableQuantity { get; set; }
    public int NearbyStoresCount { get; set; }
    public List<StoreInventoryDetailDto> CarryingStores { get; set; } = new();
    public List<ProductVariantDto> Variants { get; set; } = new();
}

public class CreateProductRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public Guid? BrandId { get; set; }
    public string? BrandName { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? ModelNumber { get; set; }

    [MaxLength(100)]
    public string? GTIN { get; set; }

    [MaxLength(100)]
    public string? MPN { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public string? VariantName { get; set; } = "Standard";
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string? Storage { get; set; }
}

public class AddStoreInventoryRequest
{
    [Required]
    public Guid ProductVariantId { get; set; }

    [Required]
    [Range(0.01, 1000000.00)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, 10000)]
    public int Quantity { get; set; }

    [MaxLength(100)]
    public string? ShelfLocation { get; set; }

    [MaxLength(100)]
    public string? SKU { get; set; }
}

public class UpdateStoreInventoryRequest
{
    [Required]
    [Range(0.01, 1000000.00)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, 10000)]
    public int Quantity { get; set; }

    [MaxLength(100)]
    public string? ShelfLocation { get; set; }

    public bool IsActive { get; set; } = true;
}

public class DuplicateCheckResultDto
{
    public bool PossibleDuplicateFound { get; set; }
    public string Reason { get; set; } = string.Empty;
    public ProductSearchResultDto? MatchedProduct { get; set; }
}
