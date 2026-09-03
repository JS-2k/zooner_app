using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface ICategoryService
{
    Task<ApiResponse<List<CategoryDto>>> GetActiveCategoriesAsync();
    Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(Guid id);
    Task<ApiResponse<List<SubCategoryDto>>> GetSubCategoriesAsync(Guid categoryId);
    Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest request);
    Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request);
    Task<ApiResponse> ToggleCategoryStatusAsync(Guid id, bool isActive);
    Task<ApiResponse> ReorderCategoriesAsync(List<ReorderCategoryItemRequest> items);
    Task<ApiResponse<SubCategoryDto>> CreateSubCategoryAsync(CreateSubCategoryRequest request);
    Task<ApiResponse<SubCategoryDto>> UpdateSubCategoryAsync(Guid id, UpdateSubCategoryRequest request);
}
