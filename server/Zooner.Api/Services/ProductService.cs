using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services.Location;

namespace Zooner.Api.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProductService> _logger;

    public ProductService(AppDbContext context, ILogger<ProductService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ApiResponse<List<ProductSearchResultDto>>> SearchProductsAsync(
        string? query,
        string? categorySlug,
        double? userLat,
        double? userLon,
        int page = 1,
        int pageSize = 20)
    {
        var rawQuery = (query ?? string.Empty).Trim();
        var normalizedQuery = NormalizeText(rawQuery);

        var dbQuery = _context.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .Where(p => p.IsActive)
            .AsNoTracking();

        // Filter by Category Slug if provided
        if (!string.IsNullOrWhiteSpace(categorySlug) && !categorySlug.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var catSlugNorm = categorySlug.Trim().ToLower();
            dbQuery = dbQuery.Where(p => p.Category != null && 
                (p.Category.Slug.ToLower() == catSlugNorm || p.Category.Name.ToLower().Contains(catSlugNorm)));
        }

        // Intelligent Multi-Field Normalized Search
        if (!string.IsNullOrWhiteSpace(rawQuery))
        {
            var terms = rawQuery.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var normTerms = normalizedQuery.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            dbQuery = dbQuery.Where(p =>
                // 1. Direct GTIN / ModelNumber / MPN match
                (p.GTIN != null && p.GTIN.Contains(rawQuery)) ||
                (p.ModelNumber != null && p.ModelNumber.ToLower().Contains(rawQuery.ToLower())) ||
                (p.MPN != null && p.MPN.ToLower().Contains(rawQuery.ToLower())) ||
                // 2. Normalized Name match
                p.NormalizedName.Contains(normalizedQuery) ||
                // 3. Name or Brand contains terms
                terms.All(term =>
                    p.Name.ToLower().Contains(term) ||
                    (p.Brand != null && p.Brand.Name.ToLower().Contains(term)) ||
                    (p.ModelNumber != null && p.ModelNumber.ToLower().Contains(term)) ||
                    p.Variants.Any(v => v.VariantName.ToLower().Contains(term) || (v.SKU != null && v.SKU.ToLower().Contains(term)))
                )
            );
        }

        var productsList = await dbQuery
            .OrderByDescending(p => p.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var productIds = productsList.Select(p => p.Id).ToList();

        // Fetch active store inventories for matching products
        var inventories = await _context.StoreInventories
            .Include(si => si.Store)
            .Include(si => si.ProductVariant)
            .Where(si => si.IsActive && 
                         si.ProductVariant != null && 
                         productIds.Contains(si.ProductVariant.ProductId) && 
                         si.Store != null && 
                         si.Store.IsActive)
            .AsNoTracking()
            .ToListAsync();

        var results = new List<ProductSearchResultDto>();

        foreach (var prod in productsList)
        {
            var prodInventories = inventories
                .Where(si => si.ProductVariant?.ProductId == prod.Id)
                .ToList();

            var carryingStores = new List<StoreInventoryDetailDto>();

            foreach (var inv in prodInventories)
            {
                if (inv.Store == null || inv.ProductVariant == null) continue;

                double? dist = null;
                if (userLat.HasValue && userLon.HasValue)
                {
                    dist = GeoLocationHelper.CalculateDistanceKm(userLat.Value, userLon.Value, inv.Store.Latitude, inv.Store.Longitude);
                }

                carryingStores.Add(new StoreInventoryDetailDto
                {
                    InventoryId = inv.Id,
                    StoreId = inv.Store.Id,
                    StoreName = inv.Store.Name,
                    StoreAddress = inv.Store.Address,
                    StorePhone = inv.Store.Phone,
                    Latitude = inv.Store.Latitude,
                    Longitude = inv.Store.Longitude,
                    DistanceKm = dist,
                    IsStoreOpen = inv.Store.IsLiveEnabled,
                    VariantId = inv.ProductVariantId,
                    VariantName = inv.ProductVariant.VariantName,
                    Price = inv.Price,
                    Quantity = inv.Quantity,
                    AvailableQuantity = inv.AvailableQuantity,
                    ShelfLocation = inv.ShelfLocation,
                    UpdatedAtUtc = inv.UpdatedAtUtc
                });
            }

            // Sort carrying stores by distance if location provided, else by price
            if (userLat.HasValue && userLon.HasValue)
            {
                carryingStores = carryingStores.OrderBy(s => s.DistanceKm ?? 9999).ThenBy(s => s.Price).ToList();
            }
            else
            {
                carryingStores = carryingStores.OrderBy(s => s.Price).ToList();
            }

            var minPrice = carryingStores.Count > 0 ? carryingStores.Min(s => s.Price) : 0m;
            var maxPrice = carryingStores.Count > 0 ? carryingStores.Max(s => s.Price) : 0m;
            var totalAvailable = carryingStores.Sum(s => s.AvailableQuantity);

            results.Add(new ProductSearchResultDto
            {
                Id = prod.Id,
                Name = prod.Name,
                BrandName = prod.Brand?.Name,
                CategoryName = prod.Category?.Name ?? "General",
                ModelNumber = prod.ModelNumber,
                GTIN = prod.GTIN,
                MPN = prod.MPN,
                Description = prod.Description,
                ImageUrl = prod.ImageUrl,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                TotalAvailableQuantity = totalAvailable,
                NearbyStoresCount = carryingStores.Count,
                CarryingStores = carryingStores,
                Variants = prod.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    ProductId = v.ProductId,
                    VariantName = v.VariantName,
                    Color = v.Color,
                    Size = v.Size,
                    Storage = v.Storage,
                    GTIN = v.GTIN,
                    SKU = v.SKU
                }).ToList()
            });
        }

        return ApiResponse<List<ProductSearchResultDto>>.SuccessResponse(results, "Products retrieved successfully.");
    }

    public async Task<ApiResponse<ProductSearchResultDto>> GetProductByIdAsync(Guid productId, double? userLat, double? userLon)
    {
        var prod = await _context.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive);

        if (prod == null)
        {
            return ApiResponse<ProductSearchResultDto>.ErrorResponse("Product not found.");
        }

        var storesResult = await GetProductStoresAsync(productId, userLat, userLon);
        var carryingStores = storesResult.Data ?? new List<StoreInventoryDetailDto>();

        var minPrice = carryingStores.Count > 0 ? carryingStores.Min(s => s.Price) : 0m;
        var maxPrice = carryingStores.Count > 0 ? carryingStores.Max(s => s.Price) : 0m;
        var totalAvailable = carryingStores.Sum(s => s.AvailableQuantity);

        var dto = new ProductSearchResultDto
        {
            Id = prod.Id,
            Name = prod.Name,
            BrandName = prod.Brand?.Name,
            CategoryName = prod.Category?.Name ?? "General",
            ModelNumber = prod.ModelNumber,
            GTIN = prod.GTIN,
            MPN = prod.MPN,
            Description = prod.Description,
            ImageUrl = prod.ImageUrl,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            TotalAvailableQuantity = totalAvailable,
            NearbyStoresCount = carryingStores.Count,
            CarryingStores = carryingStores,
            Variants = prod.Variants.Select(v => new ProductVariantDto
            {
                Id = v.Id,
                ProductId = v.ProductId,
                VariantName = v.VariantName,
                Color = v.Color,
                Size = v.Size,
                Storage = v.Storage,
                GTIN = v.GTIN,
                SKU = v.SKU
            }).ToList()
        };

        return ApiResponse<ProductSearchResultDto>.SuccessResponse(dto);
    }

    public async Task<ApiResponse<List<StoreInventoryDetailDto>>> GetProductStoresAsync(Guid productId, double? userLat, double? userLon)
    {
        var inventories = await _context.StoreInventories
            .Include(si => si.Store)
            .Include(si => si.ProductVariant)
            .Where(si => si.IsActive && 
                         si.ProductVariant != null && 
                         si.ProductVariant.ProductId == productId && 
                         si.Store != null && 
                         si.Store.IsActive)
            .AsNoTracking()
            .ToListAsync();

        var carryingStores = new List<StoreInventoryDetailDto>();

        foreach (var inv in inventories)
        {
            if (inv.Store == null || inv.ProductVariant == null) continue;

            double? dist = null;
            if (userLat.HasValue && userLon.HasValue)
            {
                dist = GeoLocationHelper.CalculateDistanceKm(userLat.Value, userLon.Value, inv.Store.Latitude, inv.Store.Longitude);
            }

            carryingStores.Add(new StoreInventoryDetailDto
            {
                InventoryId = inv.Id,
                StoreId = inv.Store.Id,
                StoreName = inv.Store.Name,
                StoreAddress = inv.Store.Address,
                StorePhone = inv.Store.Phone,
                Latitude = inv.Store.Latitude,
                Longitude = inv.Store.Longitude,
                DistanceKm = dist,
                IsStoreOpen = inv.Store.IsLiveEnabled,
                VariantId = inv.ProductVariantId,
                VariantName = inv.ProductVariant.VariantName,
                Price = inv.Price,
                Quantity = inv.Quantity,
                AvailableQuantity = inv.AvailableQuantity,
                ShelfLocation = inv.ShelfLocation,
                UpdatedAtUtc = inv.UpdatedAtUtc
            });
        }

        if (userLat.HasValue && userLon.HasValue)
        {
            carryingStores = carryingStores.OrderBy(s => s.DistanceKm ?? 9999).ThenBy(s => s.Price).ToList();
        }
        else
        {
            carryingStores = carryingStores.OrderBy(s => s.Price).ToList();
        }

        return ApiResponse<List<StoreInventoryDetailDto>>.SuccessResponse(carryingStores);
    }

    public async Task<ApiResponse<DuplicateCheckResultDto>> CheckDuplicateProductAsync(
        string? gtin,
        string? brandName,
        string? modelNumber,
        string? name)
    {
        // 1. Check GTIN match if GTIN is provided
        if (!string.IsNullOrWhiteSpace(gtin))
        {
            var cleanGtin = gtin.Trim();
            var matchedByGtin = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.GTIN == cleanGtin && p.IsActive);

            if (matchedByGtin != null)
            {
                var prodDto = await GetProductByIdAsync(matchedByGtin.Id, null, null);
                return ApiResponse<DuplicateCheckResultDto>.SuccessResponse(new DuplicateCheckResultDto
                {
                    PossibleDuplicateFound = true,
                    Reason = $"An exact product with barcode/GTIN '{cleanGtin}' already exists.",
                    MatchedProduct = prodDto.Data
                });
            }
        }

        // 2. Check Brand + ModelNumber match
        if (!string.IsNullOrWhiteSpace(brandName) && !string.IsNullOrWhiteSpace(modelNumber))
        {
            var normBrand = NormalizeText(brandName);
            var normModel = modelNumber.Trim().ToLower();

            var matchedByModel = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Brand != null && 
                    p.Brand.NormalizedName == normBrand && 
                    p.ModelNumber != null && 
                    p.ModelNumber.ToLower() == normModel && 
                    p.IsActive);

            if (matchedByModel != null)
            {
                var prodDto = await GetProductByIdAsync(matchedByModel.Id, null, null);
                return ApiResponse<DuplicateCheckResultDto>.SuccessResponse(new DuplicateCheckResultDto
                {
                    PossibleDuplicateFound = true,
                    Reason = $"Product with brand '{brandName}' and model '{modelNumber}' already exists.",
                    MatchedProduct = prodDto.Data
                });
            }
        }

        // 3. Check Exact Normalized Name match
        if (!string.IsNullOrWhiteSpace(name))
        {
            var normName = NormalizeText(name);
            var matchedByName = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.NormalizedName == normName && p.IsActive);

            if (matchedByName != null)
            {
                var prodDto = await GetProductByIdAsync(matchedByName.Id, null, null);
                return ApiResponse<DuplicateCheckResultDto>.SuccessResponse(new DuplicateCheckResultDto
                {
                    PossibleDuplicateFound = true,
                    Reason = $"Product '{matchedByName.Name}' already exists in global catalog.",
                    MatchedProduct = prodDto.Data
                });
            }
        }

        return ApiResponse<DuplicateCheckResultDto>.SuccessResponse(new DuplicateCheckResultDto
        {
            PossibleDuplicateFound = false,
            Reason = "No duplicate product found."
        });
    }

    public async Task<ApiResponse<ProductSearchResultDto>> CreateGlobalProductAsync(CreateProductRequest request)
    {
        // Perform duplicate check first
        var dupCheck = await CheckDuplicateProductAsync(request.GTIN, request.BrandName, request.ModelNumber, request.Name);
        if (dupCheck.Data != null && dupCheck.Data.PossibleDuplicateFound && dupCheck.Data.MatchedProduct != null)
        {
            return ApiResponse<ProductSearchResultDto>.SuccessResponse(dupCheck.Data.MatchedProduct, "Existing product matched in global catalog.");
        }

        Guid? brandId = request.BrandId;
        if (!brandId.HasValue && !string.IsNullOrWhiteSpace(request.BrandName))
        {
            var normBrandName = NormalizeText(request.BrandName);
            var existingBrand = await _context.Brands.FirstOrDefaultAsync(b => b.NormalizedName == normBrandName);
            if (existingBrand != null)
            {
                brandId = existingBrand.Id;
            }
            else
            {
                var newBrand = new Brand
                {
                    Id = Guid.NewGuid(),
                    Name = request.BrandName.Trim(),
                    NormalizedName = normBrandName,
                    CreatedAtUtc = DateTime.UtcNow
                };
                _context.Brands.Add(newBrand);
                await _context.SaveChangesAsync();
                brandId = newBrand.Id;
            }
        }

        var normalizedProductName = NormalizeText(request.Name);
        var product = new Product
        {
            Id = Guid.NewGuid(),
            BrandId = brandId,
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            NormalizedName = normalizedProductName,
            Description = request.Description ?? string.Empty,
            ModelNumber = request.ModelNumber?.Trim(),
            GTIN = request.GTIN?.Trim(),
            MPN = request.MPN?.Trim(),
            ImageUrl = request.ImageUrl,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        var defaultVariant = new ProductVariant
        {
            Id = Guid.NewGuid(),
            ProductId = product.Id,
            VariantName = string.IsNullOrWhiteSpace(request.VariantName) ? "Standard" : request.VariantName.Trim(),
            Color = request.Color,
            Size = request.Size,
            Storage = request.Storage,
            GTIN = request.GTIN?.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        product.Variants.Add(defaultVariant);

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return await GetProductByIdAsync(product.Id, null, null);
    }

    private static string NormalizeText(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;
        var clean = Regex.Replace(text.ToUpper(), @"[^A-Z0-9\s]", " ");
        return Regex.Replace(clean, @"\s+", " ").Trim();
    }
}
