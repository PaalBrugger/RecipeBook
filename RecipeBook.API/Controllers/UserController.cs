using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.API.Database;
using RecipeBook.API.Models;
using RecipeBook.API.Utility;

namespace RecipeBook.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDBContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserController(ApplicationDBContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var user = await _userManager.FindByNameAsync(username);
        if (user == null) return NotFound();
        
        return Ok(new { user.UserName, user.Email, user.Name, user.City, user.Country, user.PostalCode });
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateUserModel model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();
        
        var user = await _userManager.FindByNameAsync(username);
        if (user == null) return NotFound();

        user.UserName = model.Username;
        user.Email = model.Email;
        user.Name = model.Name;
        user.City = model.City;
        user.Country = model.Country;
        user.PostalCode = model.PostalCode;
        
        var result = await _userManager.UpdateAsync(user);
        if (result.Succeeded) return Ok(new {message = "User Updated Successfully"});
        
        return BadRequest(result.Errors);
    }
    
    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMe()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();
        
        var user = await _userManager.FindByNameAsync(username);
        if (user == null) return NotFound();
        
        var result = await _userManager.DeleteAsync(user);
        
        if (result.Succeeded) return Ok(new {message = "User Deleted Successfully"});
        
        return BadRequest(new {result.Errors});
    }
    
    [HttpPost("favorite-recipe")]
    public async Task<IActionResult> FavoriteRecipe([FromBody] int recipeId)     // Move to usercontroller

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
    
    [HttpGet("is-favorited/{recipeId}")]
    public async Task<IActionResult> IsFavorited(int recipeId)
    {
        var userId = _userManager.GetUserId(User);
        if(userId == null) return Unauthorized();
        
        var isFavorited = await _dbContext.FavoritedRecipes
            .AnyAsync(r => r.RecipeId == recipeId && r.UserId == userId); 
        
        return Ok(new {isFavorited});
    }
    
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
    [HttpGet("get-user-created-recipes")]
    public async Task<IActionResult> GetUserCreatedRecipes()
    {
        var userId = _userManager.GetUserId(User);
        var recipes = await _dbContext.Recipes
             .Include(r => r.Ingredients)
             .Where(r => r.UserId == userId)
             .ToListAsync();
        
        var recipesDto = DTOTransformers.CreateRecipeDTOList(recipes);
            
        return Ok(recipesDto);
    }

    [HttpPost("create-recipe")]
    public async Task<IActionResult> CreateRecipe([FromForm] RecipeCreateDTO recipeDto)
    {
        if(!ModelState.IsValid) return BadRequest(ModelState);
        
        var recipe = new Recipe{ Name = recipeDto.Name, Category = recipeDto.Category, 
            Area = recipeDto.Area,Description = recipeDto.Description,
            Instructions = recipeDto.Instructions, Source = recipeDto.Source, 
            Youtube = recipeDto.Youtube, UserId = _userManager.GetUserId(User),
            Ingredients = recipeDto.Ingredients?
                .Where(i => !string.IsNullOrWhiteSpace(i.Name))
                .Select(i => new Ingredient
                {
                    Name = i.Name!.Trim(),
                    Measure = i.Measure ?? ""
                })
                .ToList() ?? new List<Ingredient>()
        };
        if (recipeDto.ImageFile != null)
        {
            var imageUrl = await HelperMethods.SaveImageAsync(recipeDto.ImageFile);
             recipe.MainImageUrl = imageUrl;
             recipe.ImageGallery.Add(new RecipeImage{ ImageUrl = imageUrl});
        }
        
        _dbContext.Recipes.Add(recipe);
        await _dbContext.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPut("update-recipe")]
    public async Task<IActionResult> UpdateRecipe()
    {
        return NotFound();
    }
}