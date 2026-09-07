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

    public async Task<ApiResponse<InventoryHoldDto>> ReserveInventoryHoldAsync(
        Guid storeId,
        Guid inventoryId,
        Guid customerId,
        int quantityToHold = 1)
    {
        if (quantityToHold < 1 || quantityToHold > 5)
        {
            return ApiResponse<InventoryHoldDto>.ErrorResponse("Quantity to hold must be between 1 and 5 items.");
        }

        var store = await _context.Shops.FirstOrDefaultAsync(s => s.Id == storeId && s.IsActive);
        if (store == null)
        {
            return ApiResponse<InventoryHoldDto>.ErrorResponse("Store not found or inactive.");
        }

        var inventory = await _context.StoreInventories
            .Include(si => si.ProductVariant)
            .ThenInclude(pv => pv!.Product)
            .FirstOrDefaultAsync(si => si.Id == inventoryId && si.StoreId == storeId && si.IsActive);

        if (inventory == null)
        {
            return ApiResponse<InventoryHoldDto>.ErrorResponse("Inventory record not found for this store.");
        }

        // Clean up any naturally expired holds for this inventory item before checking stock
        var expiredHolds = await _context.InventoryHolds
            .Where(ih => ih.StoreInventoryId == inventoryId && ih.Status == InventoryHoldStatus.Active && ih.ExpiresAtUtc <= DateTime.UtcNow)
            .ToListAsync();

        if (expiredHolds.Any())
        {
            foreach (var eh in expiredHolds)
            {
                eh.Status = InventoryHoldStatus.Expired;
                inventory.AvailableQuantity = Math.Min(inventory.Quantity, inventory.AvailableQuantity + eh.Quantity);
            }
            await _context.SaveChangesAsync();
        }

        // Prevent duplicate concurrent active holds by the same customer on the same product item
        var existingCustomerHold = await _context.InventoryHolds
            .AnyAsync(ih => ih.StoreInventoryId == inventoryId && ih.CustomerId == customerId && ih.Status == InventoryHoldStatus.Active && ih.ExpiresAtUtc > DateTime.UtcNow);

        if (existingCustomerHold)
        {
            return ApiResponse<InventoryHoldDto>.ErrorResponse("You already have an active hold pass for this item.");
        }

        if (inventory.AvailableQuantity < quantityToHold)
        {
            return ApiResponse<InventoryHoldDto>.ErrorResponse($"Insufficient stock for 30-min hold. Available: {inventory.AvailableQuantity}");
        }

        // Atomic deduction
        inventory.AvailableQuantity -= quantityToHold;
        inventory.UpdatedAtUtc = DateTime.UtcNow;

        var holdCode = $"H-{Random.Shared.Next(1000, 9999)}";
        var hold = new InventoryHold
        {
            Id = Guid.NewGuid(),
            StoreInventoryId = inventory.Id,
            StoreId = store.Id,
            CustomerId = customerId,
            Quantity = quantityToHold,
            HoldCode = holdCode,
            Status = InventoryHoldStatus.Active,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(30),
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.InventoryHolds.Add(hold);
        await _context.SaveChangesAsync();

        var dto = new InventoryHoldDto
        {
            HoldId = hold.Id,
            StoreInventoryId = inventory.Id,
            StoreId = store.Id,
            StoreName = store.Name,
            StoreAddress = store.Address,
            StorePhone = store.Phone,
            ProductName = inventory.ProductVariant?.Product?.Name ?? "Product Item",
            VariantName = inventory.ProductVariant?.VariantName ?? "Standard",
            Price = inventory.Price,
            Quantity = hold.Quantity,
            HoldCode = hold.HoldCode,
            Status = hold.Status.ToString(),
            ExpiresAtUtc = hold.ExpiresAtUtc,
            CreatedAtUtc = hold.CreatedAtUtc
        };

        return ApiResponse<InventoryHoldDto>.SuccessResponse(dto, $"Reserved {quantityToHold} item(s) for 30 minutes with code {holdCode}.");
    }

    public async Task<ApiResponse<bool>> ReleaseInventoryHoldAsync(
        Guid storeId,
        Guid inventoryId,
        Guid holdId,
        Guid requestingUserId)
    {
        var hold = await _context.InventoryHolds
            .Include(ih => ih.Store)
            .Include(ih => ih.StoreInventory)
            .FirstOrDefaultAsync(ih => ih.Id == holdId && ih.StoreId == storeId && ih.StoreInventoryId == inventoryId);

        if (hold == null)
        {
            return ApiResponse<bool>.ErrorResponse("Hold reservation not found.");
        }

        // Authorization: Only the Customer who reserved it, the Store Owner, or an Admin can release it
        var isCustomer = hold.CustomerId == requestingUserId;
        var isStoreOwner = hold.Store?.OwnerId == requestingUserId;
        var isAdmin = await _context.Users.AnyAsync(u => u.Id == requestingUserId && u.Role == "Admin");


        if (!isCustomer && !isStoreOwner && !isAdmin)
        {
            return ApiResponse<bool>.ErrorResponse("Unauthorized: You do not have permission to release this hold pass.");
        }

        if (hold.Status != InventoryHoldStatus.Active)
        {
            return ApiResponse<bool>.ErrorResponse($"Hold is already in '{hold.Status}' status.");
        }

        hold.Status = InventoryHoldStatus.Released;
        hold.ReleasedAtUtc = DateTime.UtcNow;

        if (hold.StoreInventory != null)
        {
            hold.StoreInventory.AvailableQuantity = Math.Min(hold.StoreInventory.Quantity, hold.StoreInventory.AvailableQuantity + hold.Quantity);
            hold.StoreInventory.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Hold pass released and inventory restored to available stock.");
    }

    public async Task<ApiResponse<List<InventoryHoldDto>>> GetActiveHoldsForCustomerAsync(Guid customerId)
    {
        // Expire any outdated holds first
        var expired = await _context.InventoryHolds
            .Include(ih => ih.StoreInventory)
            .Where(ih => ih.CustomerId == customerId && ih.Status == InventoryHoldStatus.Active && ih.ExpiresAtUtc <= DateTime.UtcNow)
            .ToListAsync();

        if (expired.Any())
        {
            foreach (var eh in expired)
            {
                eh.Status = InventoryHoldStatus.Expired;
                if (eh.StoreInventory != null)
                {
                    eh.StoreInventory.AvailableQuantity = Math.Min(eh.StoreInventory.Quantity, eh.StoreInventory.AvailableQuantity + eh.Quantity);
                }
            }
            await _context.SaveChangesAsync();
        }

        var activeHolds = await _context.InventoryHolds
            .Where(ih => ih.CustomerId == customerId && ih.Status == InventoryHoldStatus.Active)
            .Include(ih => ih.Store)
            .Include(ih => ih.StoreInventory)
                .ThenInclude(si => si!.ProductVariant)
                .ThenInclude(pv => pv!.Product)
            .OrderByDescending(ih => ih.CreatedAtUtc)
            .AsNoTracking()
            .ToListAsync();

        var dtos = activeHolds.Select(h => new InventoryHoldDto
        {
            HoldId = h.Id,
            StoreInventoryId = h.StoreInventoryId,
            StoreId = h.StoreId,
            StoreName = h.Store?.Name ?? string.Empty,
            StoreAddress = h.Store?.Address ?? string.Empty,
            StorePhone = h.Store?.Phone ?? string.Empty,
            ProductName = h.StoreInventory?.ProductVariant?.Product?.Name ?? "Product Item",
            VariantName = h.StoreInventory?.ProductVariant?.VariantName ?? "Standard",
            Price = h.StoreInventory?.Price ?? 0,
            Quantity = h.Quantity,
            HoldCode = h.HoldCode,
            Status = h.Status.ToString(),
            ExpiresAtUtc = h.ExpiresAtUtc,
            CreatedAtUtc = h.CreatedAtUtc
        }).ToList();

        return ApiResponse<List<InventoryHoldDto>>.SuccessResponse(dtos);
    }
}
