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
    private readonly UserManager<ApplicationUser> _userManager;

    
    public RecipeController(ApplicationDBContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
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
        
        if(recipes.Count == 0) return Ok(new List<RecipeDTO>());
        
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
        
        if(recipes.Count == 0) return Ok(new List<RecipeDTO>());
        
        var recipesDtoList = DTOTransformers.CreateRecipeDTOList(recipes);
        
        return Ok(recipesDtoList);
    }
    
    [Authorize]
    [HttpPost("favorite-recipe")]
    public async Task<IActionResult> FavoriteRecipe([FromBody] int recipeId)
    {
        var userId = _userManager.GetUserId(User);
        if(userId == null) return Unauthorized();
        
        var recipeExists = await _dbContext.Recipes.AnyAsync(r => r.Id == recipeId);
        if (!recipeExists) return NotFound();

        var favoritedrecipe = new FavoritedRecipe()
        {
            RecipeId = recipeId,
            UserId = userId,
        };
        
        _dbContext.FavoritedRecipes.Add(favoritedrecipe);
        await _dbContext.SaveChangesAsync();
        
        return Ok();
    }
    
    [Authorize]
    [HttpPost("unfavorite-recipe")]
    public async Task<IActionResult> UnfavoriteRecipe([FromBody] int recipeId)
    {
        var userId = _userManager.GetUserId(User);
        if(userId == null) return Unauthorized();
        
        var alreadyFavorited =
            await _dbContext.FavoritedRecipes
                .Where(r => r.RecipeId == recipeId && r.UserId == userId)
                .FirstOrDefaultAsync();

        if (alreadyFavorited != null)
        {
            _dbContext.FavoritedRecipes.Remove(alreadyFavorited);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        return NotFound();
    }
    
    [Authorize]
    [HttpGet("is-favorited/{recipeId}")]
    public async Task<IActionResult> IsFavorited(int recipeId)
    {
        var userId = _userManager.GetUserId(User);
        if(userId == null) return Unauthorized();
        
        var isFavorited = await _dbContext.FavoritedRecipes
            .AnyAsync(r => r.RecipeId == recipeId && r.UserId == userId); 
        
        return Ok(new {isFavorited});
    }

    [Authorize]
    [HttpGet("get-favorited-recipes")]
    public async Task<IActionResult> GetFavoritedRecipes()
    {
        var userId = _userManager.GetUserId(User);
        if(userId == null) return Unauthorized();

        var favoritedRecipesDTO = await _dbContext.FavoritedRecipes
            .Include(r => r.Recipe.Ingredients)
            .Where(r => r.UserId == userId)
            .Select(fav => DTOTransformers.CreateRecipeDTO(fav.Recipe))
            .ToListAsync();
        
        return Ok(favoritedRecipesDTO);
    }
    
}