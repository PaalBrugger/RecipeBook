using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.API.Database;
using RecipeBook.API.Models;
using RecipeBook.API.Utility;

namespace RecipeBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly ApplicationDBContext _dbContext;
    
    public RecipeController(ApplicationDBContext dbContext)
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

       var recipeDto = DTOTransformers.CreateRecipeDTO(recipe);
       
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
        
        var recipeDto = DTOTransformers.CreateRecipeDTO(recipe);
       
        return Ok(recipeDto);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchRecipes([FromQuery] string searchTerm)
    {
        var recipes = await _dbContext.Recipes
            .Include(r => r.Ingredients)
            .Where(r => r.Name.Contains(searchTerm.ToLower()))
            .ToListAsync();
        
        var recipesDto = DTOTransformers.CreateRecipeDTOList(recipes);
            
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
        
        var recipesDtoList = DTOTransformers.CreateRecipeDTOList(recipes);
        
        return Ok(recipesDtoList);
    }
}