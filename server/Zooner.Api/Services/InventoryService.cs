using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _context;
    private readonly ILogger<InventoryService> _logger;

    public InventoryService(AppDbContext context, ILogger<InventoryService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ApiResponse<List<StoreInventoryDetailDto>>> GetStoreInventoryAsync(
        Guid storeId,
        string? search,
        Guid? categoryId)
    {
        var store = await _context.Shops.FirstOrDefaultAsync(s => s.Id == storeId);
        if (store == null)
        {
            return ApiResponse<List<StoreInventoryDetailDto>>.ErrorResponse("Store not found.");
        }

        var dbQuery = _context.StoreInventories
            .Include(si => si.ProductVariant)
                .ThenInclude(pv => pv!.Product)
                    .ThenInclude(p => p!.Brand)
            .Where(si => si.StoreId == storeId && si.IsActive)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var cleanSearch = search.Trim().ToLower();
            dbQuery = dbQuery.Where(si =>
                (si.ProductVariant != null && si.ProductVariant.Product != null &&
                    (si.ProductVariant.Product.Name.ToLower().Contains(cleanSearch) ||
                     (si.ProductVariant.Product.Brand != null && si.ProductVariant.Product.Brand.Name.ToLower().Contains(cleanSearch)) ||
                     (si.ProductVariant.Product.ModelNumber != null && si.ProductVariant.Product.ModelNumber.ToLower().Contains(cleanSearch)))) ||
                (si.ShelfLocation != null && si.ShelfLocation.ToLower().Contains(cleanSearch)) ||
                (si.SKU != null && si.SKU.ToLower().Contains(cleanSearch))
            );
        }

        if (categoryId.HasValue)
        {
            dbQuery = dbQuery.Where(si => si.ProductVariant != null && 
                                          si.ProductVariant.Product != null && 
                                          si.ProductVariant.Product.CategoryId == categoryId.Value);
        }

        var inventories = await dbQuery
            .OrderByDescending(si => si.UpdatedAtUtc)
            .ToListAsync();

        var dtos = inventories.Select(inv => new StoreInventoryDetailDto
        {
            InventoryId = inv.Id,
            StoreId = inv.StoreId,
            StoreName = store.Name,
            StoreAddress = store.Address,
            StorePhone = store.Phone,
            Latitude = store.Latitude,
            Longitude = store.Longitude,
            IsStoreOpen = store.IsLiveEnabled,
            VariantId = inv.ProductVariantId,
            VariantName = inv.ProductVariant?.VariantName ?? "Default",
            Price = inv.Price,
            Quantity = inv.Quantity,
            AvailableQuantity = inv.AvailableQuantity,
            ShelfLocation = inv.ShelfLocation,
            UpdatedAtUtc = inv.UpdatedAtUtc
        }).ToList();

        return ApiResponse<List<StoreInventoryDetailDto>>.SuccessResponse(dtos);
    }

    public async Task<ApiResponse<StoreInventoryDetailDto>> AddStoreInventoryAsync(
        Guid storeId,
        Guid ownerUserId,
        AddStoreInventoryRequest request)
    {
        var store = await _context.Shops.FirstOrDefaultAsync(s => s.Id == storeId);
        if (store == null)
        {
            return ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Store not found.");
        }

        // Verify Store Ownership
        if (store.OwnerId != ownerUserId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == ownerUserId);
            if (user == null || !user.IsAdmin)
            {
                return ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Unauthorized: You do not own this store.");
            }
        }

        var variant = await _context.ProductVariants
            .Include(pv => pv.Product)
            .FirstOrDefaultAsync(pv => pv.Id == request.ProductVariantId && pv.IsActive);

        if (variant == null)
        {
            return ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Product variant not found.");
        }

        // Check if inventory already exists for this variant in this store
        var existing = await _context.StoreInventories
            .FirstOrDefaultAsync(si => si.StoreId == storeId && si.ProductVariantId == request.ProductVariantId);

        if (existing != null)
        {
            existing.Price = request.Price;
            existing.Quantity = request.Quantity;
            existing.AvailableQuantity = Math.Max(0, request.Quantity - Math.Max(0, existing.Quantity - existing.AvailableQuantity));
            existing.ShelfLocation = request.ShelfLocation ?? existing.ShelfLocation;
            existing.SKU = request.SKU ?? existing.SKU;
            existing.IsActive = true;
            existing.UpdatedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse<StoreInventoryDetailDto>.SuccessResponse(new StoreInventoryDetailDto
            {
                InventoryId = existing.Id,
                StoreId = store.Id,
                StoreName = store.Name,
                StoreAddress = store.Address,
                StorePhone = store.Phone,
                Latitude = store.Latitude,
                Longitude = store.Longitude,
                IsStoreOpen = store.IsLiveEnabled,
                VariantId = variant.Id,
                VariantName = variant.VariantName,
                Price = existing.Price,
                Quantity = existing.Quantity,
                AvailableQuantity = existing.AvailableQuantity,
                ShelfLocation = existing.ShelfLocation,
                UpdatedAtUtc = existing.UpdatedAtUtc
            }, "Updated existing store inventory.");
        }

        var inventory = new StoreInventory
        {
            Id = Guid.NewGuid(),
            StoreId = storeId,
            ProductVariantId = request.ProductVariantId,
            SKU = request.SKU,
            Price = request.Price,
            Quantity = request.Quantity,
            AvailableQuantity = request.Quantity, // Initially available equals total quantity
            ShelfLocation = request.ShelfLocation,
            IsActive = true,
            UpdatedAtUtc = DateTime.UtcNow
        };

        _context.StoreInventories.Add(inventory);
        await _context.SaveChangesAsync();

        return ApiResponse<StoreInventoryDetailDto>.SuccessResponse(new StoreInventoryDetailDto
        {
            InventoryId = inventory.Id,
            StoreId = store.Id,
            StoreName = store.Name,
            StoreAddress = store.Address,
            StorePhone = store.Phone,
            Latitude = store.Latitude,
            Longitude = store.Longitude,
            IsStoreOpen = store.IsLiveEnabled,
            VariantId = variant.Id,
            VariantName = variant.VariantName,
            Price = inventory.Price,
            Quantity = inventory.Quantity,
            AvailableQuantity = inventory.AvailableQuantity,
            ShelfLocation = inventory.ShelfLocation,
            UpdatedAtUtc = inventory.UpdatedAtUtc
        }, "Added product to store inventory successfully.");
    }

    public async Task<ApiResponse<StoreInventoryDetailDto>> UpdateStoreInventoryAsync(
        Guid storeId,
        Guid inventoryId,
        Guid ownerUserId,
        UpdateStoreInventoryRequest request)
    {
        var store = await _context.Shops.FirstOrDefaultAsync(s => s.Id == storeId);
        if (store == null)
        {
            return ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Store not found.");
        }

        if (store.OwnerId != ownerUserId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == ownerUserId);
            if (user == null || !user.IsAdmin)
            {
                return ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Unauthorized: You do not own this store.");
            }
        }

        var inventory = await _context.StoreInventories
            .Include(si => si.ProductVariant)
            .FirstOrDefaultAsync(si => si.Id == inventoryId && si.StoreId == storeId);

        if (inventory == null)
        {
            return ApiResponse<StoreInventoryDetailDto>.ErrorResponse("Inventory record not found.");
        }

        var reservedCount = Math.Max(0, inventory.Quantity - inventory.AvailableQuantity);
        inventory.Price = request.Price;
        inventory.Quantity = request.Quantity;
        inventory.AvailableQuantity = Math.Max(0, request.Quantity - reservedCount);
        inventory.ShelfLocation = request.ShelfLocation;
        inventory.IsActive = request.IsActive;
        inventory.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResponse<StoreInventoryDetailDto>.SuccessResponse(new StoreInventoryDetailDto
        {
            InventoryId = inventory.Id,
            StoreId = store.Id,
            StoreName = store.Name,
            StoreAddress = store.Address,
            StorePhone = store.Phone,
            Latitude = store.Latitude,
            Longitude = store.Longitude,
            IsStoreOpen = store.IsLiveEnabled,
            VariantId = inventory.ProductVariantId,
            VariantName = inventory.ProductVariant?.VariantName ?? "Default",
            Price = inventory.Price,
            Quantity = inventory.Quantity,
            AvailableQuantity = inventory.AvailableQuantity,
            ShelfLocation = inventory.ShelfLocation,
            UpdatedAtUtc = inventory.UpdatedAtUtc
        }, "Updated store inventory successfully.");
    }

    public async Task<ApiResponse<bool>> DeleteStoreInventoryAsync(Guid storeId, Guid inventoryId, Guid ownerUserId)
    {
        var store = await _context.Shops.FirstOrDefaultAsync(s => s.Id == storeId);
        if (store == null)
        {
            return ApiResponse<bool>.ErrorResponse("Store not found.");
        }

        if (store.OwnerId != ownerUserId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == ownerUserId);
            if (user == null || !user.IsAdmin)
            {
                return ApiResponse<bool>.ErrorResponse("Unauthorized: You do not own this store.");
            }
        }

        var inventory = await _context.StoreInventories.FirstOrDefaultAsync(si => si.Id == inventoryId && si.StoreId == storeId);
        if (inventory == null)
        {
            return ApiResponse<bool>.ErrorResponse("Inventory record not found.");
        }

        inventory.IsActive = false;
        inventory.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Inventory record deactivated.");
    }

    public async Task<ApiResponse<bool>> ReserveInventoryHoldAsync(Guid inventoryId, int quantityToHold = 1)
    {
        var inventory = await _context.StoreInventories.FirstOrDefaultAsync(si => si.Id == inventoryId && si.IsActive);
        if (inventory == null)
        {
            return ApiResponse<bool>.ErrorResponse("Inventory record not found.");
        }

        if (inventory.AvailableQuantity < quantityToHold)
        {
            return ApiResponse<bool>.ErrorResponse($"Insufficient stock for 30-min hold. Available: {inventory.AvailableQuantity}");
        }

        inventory.AvailableQuantity = Math.Max(0, inventory.AvailableQuantity - quantityToHold);
        inventory.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, $"Reserved {quantityToHold} item(s) for 30 minutes.");
    }

    public async Task<ApiResponse<bool>> ReleaseInventoryHoldAsync(Guid inventoryId, int quantityToRelease = 1)
    {
        var inventory = await _context.StoreInventories.FirstOrDefaultAsync(si => si.Id == inventoryId && si.IsActive);
        if (inventory == null)
        {
            return ApiResponse<bool>.ErrorResponse("Inventory record not found.");
        }

        inventory.AvailableQuantity = Math.Min(inventory.Quantity, inventory.AvailableQuantity + quantityToRelease);
        inventory.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, $"Released {quantityToRelease} item(s) back to available inventory.");
    }
}
