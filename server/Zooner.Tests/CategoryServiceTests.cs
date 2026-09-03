using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Tests;

public class CategoryServiceTests
{
    [Fact]
    public async Task CreateCategory_Succeeds_And_Generates_Slug()
    {
        using var context = TestDbContextFactory.Create(nameof(CreateCategory_Succeeds_And_Generates_Slug));
        var service = new CategoryService(context);

        var request = new CreateCategoryRequest
        {
            Name = "Sports & Fitness",
            Description = "All sporting goods",
            Icon = "dumbbell",
            DisplayOrder = 1
        };

        var response = await service.CreateCategoryAsync(request);

        Assert.True(response.Success);
        Assert.NotNull(response.Data);
        Assert.Equal("sports-and-fitness", response.Data.Slug);
        Assert.True(response.Data.IsActive);
    }

    [Fact]
    public async Task GetActiveCategories_Returns_Only_Active_In_DisplayOrder()
    {
        using var context = TestDbContextFactory.Create(nameof(GetActiveCategories_Returns_Only_Active_In_DisplayOrder));
        var service = new CategoryService(context);

        await service.CreateCategoryAsync(new CreateCategoryRequest { Name = "Cat B", DisplayOrder = 2 });
        var catA = await service.CreateCategoryAsync(new CreateCategoryRequest { Name = "Cat A", DisplayOrder = 1 });
        var catC = await service.CreateCategoryAsync(new CreateCategoryRequest { Name = "Cat C", DisplayOrder = 3 });

        // Disable Cat C
        await service.ToggleCategoryStatusAsync(catC.Data!.Id, false);

        var listResponse = await service.GetActiveCategoriesAsync();

        Assert.True(listResponse.Success);
        Assert.Equal(2, listResponse.Data!.Count);
        Assert.Equal("Cat A", listResponse.Data[0].Name);
        Assert.Equal("Cat B", listResponse.Data[1].Name);
    }

    [Fact]
    public async Task SubCategory_Can_Be_Added_And_Retrieved()
    {
        using var context = TestDbContextFactory.Create(nameof(SubCategory_Can_Be_Added_And_Retrieved));
        var service = new CategoryService(context);

        var cat = await service.CreateCategoryAsync(new CreateCategoryRequest { Name = "Books & Media" });

        var subCatRes = await service.CreateSubCategoryAsync(new CreateSubCategoryRequest
        {
            CategoryId = cat.Data!.Id,
            Name = "Comics",
            Icon = "book"
        });

        Assert.True(subCatRes.Success);
        Assert.Equal("comics", subCatRes.Data!.Slug);

        var subs = await service.GetSubCategoriesAsync(cat.Data.Id);
        Assert.Single(subs.Data!);
        Assert.Equal("Comics", subs.Data![0].Name);
    }
}
