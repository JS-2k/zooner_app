using Microsoft.EntityFrameworkCore;
using Zooner.Api.Data;
using Zooner.Api.Models;
using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CategoryDto>>> GetActiveCategoriesAsync()
    {
        var categories = await _context.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name)
            .Include(c => c.SubCategories.Where(sc => sc.IsActive).OrderBy(sc => sc.DisplayOrder))
            .AsNoTracking()
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                Icon = c.Icon,
                ImageUrl = c.ImageUrl,
                IsActive = c.IsActive,
                DisplayOrder = c.DisplayOrder,
                SubCategories = c.SubCategories.Select(sc => new SubCategoryDto
                {
                    Id = sc.Id,
                    CategoryId = sc.CategoryId,
                    Name = sc.Name,
                    Slug = sc.Slug,
                    Description = sc.Description,
                    Icon = sc.Icon,
                    IsActive = sc.IsActive,
                    DisplayOrder = sc.DisplayOrder
                }).ToList()
            })
            .ToListAsync();

        return ApiResponse<List<CategoryDto>>.Ok(categories);
    }

    public async Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(Guid id)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return ApiResponse<CategoryDto>.Fail("Category not found.");
        }

        return ApiResponse<CategoryDto>.Ok(MapToCategoryDto(category));
    }

    public async Task<ApiResponse<List<SubCategoryDto>>> GetSubCategoriesAsync(Guid categoryId)
    {
        var subCategories = await _context.SubCategories
            .Where(sc => sc.CategoryId == categoryId && sc.IsActive)
            .OrderBy(sc => sc.DisplayOrder)
            .ThenBy(sc => sc.Name)
            .AsNoTracking()
            .Select(sc => new SubCategoryDto
            {
                Id = sc.Id,
                CategoryId = sc.CategoryId,
                Name = sc.Name,
                Slug = sc.Slug,
                Description = sc.Description,
                Icon = sc.Icon,
                IsActive = sc.IsActive,
                DisplayOrder = sc.DisplayOrder
            })
            .ToListAsync();

        return ApiResponse<List<SubCategoryDto>>.Ok(subCategories);
    }

    public async Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var slug = GenerateSlug(request.Slug, request.Name);

        var exists = await _context.Categories.AnyAsync(c => c.Name.ToLower() == request.Name.ToLower() || c.Slug == slug);
        if (exists)
        {
            return ApiResponse<CategoryDto>.Fail("Category name or slug already exists.");
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description.Trim(),
            Icon = request.Icon.Trim(),
            ImageUrl = request.ImageUrl,
            DisplayOrder = request.DisplayOrder,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return ApiResponse<CategoryDto>.Ok(MapToCategoryDto(category), "Category created successfully.");
    }

    public async Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return ApiResponse<CategoryDto>.Fail("Category not found.");
        }

        var slug = GenerateSlug(request.Slug, request.Name);

        var duplicate = await _context.Categories
            .AnyAsync(c => c.Id != id && (c.Name.ToLower() == request.Name.ToLower() || c.Slug == slug));

        if (duplicate)
        {
            return ApiResponse<CategoryDto>.Fail("Category name or slug already used by another category.");
        }

        category.Name = request.Name.Trim();
        category.Slug = slug;
        category.Description = request.Description.Trim();
        category.Icon = request.Icon.Trim();
        category.ImageUrl = request.ImageUrl;
        category.IsActive = request.IsActive;
        category.DisplayOrder = request.DisplayOrder;
        category.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResponse<CategoryDto>.Ok(MapToCategoryDto(category), "Category updated successfully.");
    }

    public async Task<ApiResponse> ToggleCategoryStatusAsync(Guid id, bool isActive)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return ApiResponse.Fail("Category not found.");
        }

        category.IsActive = isActive;
        category.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse.Ok($"Category status updated to {(isActive ? "active" : "inactive")}.");
    }

    public async Task<ApiResponse> ReorderCategoriesAsync(List<ReorderCategoryItemRequest> items)
    {
        var ids = items.Select(i => i.Id).ToList();
        var categories = await _context.Categories.Where(c => ids.Contains(c.Id)).ToListAsync();

        foreach (var category in categories)
        {
            var item = items.FirstOrDefault(i => i.Id == category.Id);
            if (item != null)
            {
                category.DisplayOrder = item.DisplayOrder;
                category.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return ApiResponse.Ok("Categories reordered successfully.");
    }

    public async Task<ApiResponse<SubCategoryDto>> CreateSubCategoryAsync(CreateSubCategoryRequest request)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
        {
            return ApiResponse<SubCategoryDto>.Fail("Parent category does not exist.");
        }

        var slug = GenerateSlug(request.Slug, request.Name);
        var duplicate = await _context.SubCategories.AnyAsync(sc => sc.CategoryId == request.CategoryId && sc.Slug == slug);
        if (duplicate)
        {
            return ApiResponse<SubCategoryDto>.Fail("A subcategory with this slug already exists in this category.");
        }

        var subCategory = new SubCategory
        {
            Id = Guid.NewGuid(),
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description.Trim(),
            Icon = request.Icon.Trim(),
            DisplayOrder = request.DisplayOrder,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.SubCategories.Add(subCategory);
        await _context.SaveChangesAsync();

        return ApiResponse<SubCategoryDto>.Ok(MapToSubCategoryDto(subCategory), "Subcategory created successfully.");
    }

    public async Task<ApiResponse<SubCategoryDto>> UpdateSubCategoryAsync(Guid id, UpdateSubCategoryRequest request)
    {
        var subCategory = await _context.SubCategories.FindAsync(id);
        if (subCategory == null)
        {
            return ApiResponse<SubCategoryDto>.Fail("Subcategory not found.");
        }

        var slug = GenerateSlug(request.Slug, request.Name);
        var duplicate = await _context.SubCategories
            .AnyAsync(sc => sc.Id != id && sc.CategoryId == subCategory.CategoryId && sc.Slug == slug);

        if (duplicate)
        {
            return ApiResponse<SubCategoryDto>.Fail("A subcategory with this slug already exists in this category.");
        }

        subCategory.Name = request.Name.Trim();
        subCategory.Slug = slug;
        subCategory.Description = request.Description.Trim();
        subCategory.Icon = request.Icon.Trim();
        subCategory.IsActive = request.IsActive;
        subCategory.DisplayOrder = request.DisplayOrder;
        subCategory.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResponse<SubCategoryDto>.Ok(MapToSubCategoryDto(subCategory), "Subcategory updated successfully.");
    }

    private static string GenerateSlug(string? customSlug, string name)
    {
        var raw = string.IsNullOrWhiteSpace(customSlug) ? name : customSlug;
        return raw.Trim().ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("/", "-")
            .Replace("&", "and");
    }

    private static CategoryDto MapToCategoryDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Slug = c.Slug,
        Description = c.Description,
        Icon = c.Icon,
        ImageUrl = c.ImageUrl,
        IsActive = c.IsActive,
        DisplayOrder = c.DisplayOrder,
        SubCategories = c.SubCategories.Select(MapToSubCategoryDto).ToList()
    };

    private static SubCategoryDto MapToSubCategoryDto(SubCategory sc) => new()
    {
        Id = sc.Id,
        CategoryId = sc.CategoryId,
        Name = sc.Name,
        Slug = sc.Slug,
        Description = sc.Description,
        Icon = sc.Icon,
        IsActive = sc.IsActive,
        DisplayOrder = sc.DisplayOrder
    };
}
