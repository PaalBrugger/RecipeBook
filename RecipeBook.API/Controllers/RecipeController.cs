using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.API.Database;
using RecipeBook.API.Models;

namespace RecipeBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly ApplicationDBContext _dbContext;
    
    public RecipeController(ApplicationDBContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRecipeById(int id)
    {
       var recipe = await _dbContext.Recipes
           .Include(r => r.Ingredients)
           .FirstOrDefaultAsync(r => r.Id == id); 
       
       if(recipe == null) return NotFound();

       var recipeDto = CreateRecipeDTO(recipe);
       
       return Ok(recipeDto);
    }

    [HttpGet("random")]
    public async Task<IActionResult> GetRandomRecipe()
    {
        var recipe = await _dbContext.Recipes
            .Include(r => r.Ingredients)
            .OrderBy(r => Guid.NewGuid())
            .FirstOrDefaultAsync();
        
        if(recipe == null) return NotFound();
        
        var recipeDto = CreateRecipeDTO(recipe);
       
        return Ok(recipeDto);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchRecipes([FromQuery] string searchTerm)
    {
        var recipes = await _dbContext.Recipes
            .Include(r => r.Ingredients)
            .Where(r => r.Name.Contains(searchTerm.ToLower()))
            .ToListAsync();
        
        if(recipes.Count == 0) return Ok(new List<RecipeDTO>());
        
        var recipesDto = CreateRecipeDTOList(recipes);
            
        return Ok(recipesDto);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> FilterRecipes([FromQuery] string? category, [FromQuery] string? area)
    {
        IQueryable<Recipe> query = _dbContext.Recipes.Include(r => r.Ingredients);
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(r => r.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(area))
        {
            query = query.Where(r => r.Area == area);
        }
        var recipes = await query.ToListAsync();
        if(recipes.Count == 0) return NotFound();
        
        var recipesDtoList = CreateRecipeDTOList(recipes);
        return Ok(recipesDtoList);
    }
    private RecipeDTO CreateRecipeDTO(Recipe recipe)
    {
        var dto = new RecipeDTO()
        {
                Id = recipe.Id,
                Name = recipe.Name,
                Area = recipe.Area,
                Category = recipe.Category,
                Instructions = recipe.Instructions,
                MainImageUrl = recipe.MainImageUrl,
                Source = recipe.Source,
                Youtube = recipe.Youtube,
                Ingredients = recipe.Ingredients
                    .Select(i => new IngredientDTO
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Measure = i.Measure
                    }).ToList()
        };
        
        return dto;
    }
    private List<RecipeDTO> CreateRecipeDTOList(List<Recipe> recipes)
    {
        var dto = new List<RecipeDTO>();

        foreach (var recipe in recipes)
        {
            dto.Add(new RecipeDTO
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Area = recipe.Area,
                Category = recipe.Category,
                Instructions = recipe.Instructions,
                MainImageUrl = recipe.MainImageUrl,
                Source = recipe.Source,
                Youtube = recipe.Youtube,
                Ingredients = recipe.Ingredients
                    .Select(i => new IngredientDTO
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Measure = i.Measure
                    }).ToList()
            });
        }

        return dto;
    }

    
}