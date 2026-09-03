using Microsoft.AspNetCore.Mvc;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Retrieve all active categories and their subcategories in display order
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<CategoryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveCategories()
    {
        var response = await _categoryService.GetActiveCategoriesAsync();
        return Ok(response);
    }

    /// <summary>
    /// Retrieve a specific category by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CategoryDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCategoryById(Guid id)
    {
        var response = await _categoryService.GetCategoryByIdAsync(id);
        return response.Success ? Ok(response) : NotFound(response);
    }

    /// <summary>
    /// Retrieve active subcategories for a category
    /// </summary>
    [HttpGet("{id:guid}/subcategories")]
    [ProducesResponseType(typeof(ApiResponse<List<SubCategoryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSubCategories(Guid id)
    {
        var response = await _categoryService.GetSubCategoriesAsync(id);
        return Ok(response);
    }
}
