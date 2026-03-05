using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.API.Database;
using RecipeBook.API.Models;
using RecipeBook.API.Models.DTOs;
    

namespace RecipeBook.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDBContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(ApplicationDBContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        List <UserDTO> usersDto = await _userManager.Users
            .Include(u => u.FavoritedRecipes)
            .ThenInclude(fr => fr.Recipe)
            .Include(u => u.CreatedRecipes)
            .Select(user => new UserDTO()
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Name = user.Name,
                City = user.City,
                Country = user.Country,
                PostalCode = user.PostalCode,
                PhoneNumber = user.PhoneNumber,
                FavoritedRecipes = user.FavoritedRecipes
                    .Select(r => new RecipeSummaryDTO(){Id = r.RecipeId, Name = r.Recipe.Name})
                    .ToList(),
                CreatedRecipes = user.CreatedRecipes
                    .Select(r => new RecipeSummaryDTO(){Id = r.Id, Name = r.Name})
                    .ToList()
            }
        ).ToListAsync();
        
        return Ok(usersDto);
    }
    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _dbContext.Users
            .Include(u => u.FavoritedRecipes)
            .ThenInclude(fr => fr.Recipe)
            .Include(u => u.CreatedRecipes)
            .FirstOrDefaultAsync(u => u.Id == id); 
        
        if (user == null) return NotFound();
        
        var userDto = new UserDTO()
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Name = user.Name,
            City = user.City,
            Country = user.Country,
            PostalCode = user.PostalCode,
            PhoneNumber = user.PhoneNumber,
            FavoritedRecipes = user.FavoritedRecipes
                .Select(r => new RecipeSummaryDTO() { Id = r.RecipeId, Name = r.Recipe.Name })
                .ToList(),
            CreatedRecipes = user.CreatedRecipes
                .Select(r => new RecipeSummaryDTO() { Id = r.Id, Name = r.Name })
                .ToList()
        };

        return Ok(userDto);
    }

    [HttpPut("user/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDTO userDto)
    {
        if(!ModelState.IsValid) return BadRequest(ModelState);
        
        var user = _userManager.Users.FirstOrDefault(u => u.Id == id);
        if (user == null) return NotFound();
        user.UserName = userDto.UserName;
        user.Email = userDto.Email;
        user.Name = userDto.Name;
        user.City = userDto.City;
        user.Country = userDto.Country;
        user.PostalCode = userDto.PostalCode;
        user.PhoneNumber = userDto.PhoneNumber;
        await _userManager.UpdateAsync(user);  
        await _dbContext.SaveChangesAsync();
        
        return Ok(new {message = "User Updated Successfully"});
    }
    
    [HttpPost("unfavorite-recipe")]
    public async Task<IActionResult> UnfavoriteRecipe([FromBody] UnfavoriteRequest request)
    {
        if(!ModelState.IsValid) return BadRequest(ModelState);
        
        var alreadyFavorited =
            await _dbContext.FavoritedRecipes
                .Where(r => r.RecipeId == request.RecipeId && r.UserId == request.UserId)
                .FirstOrDefaultAsync();

        if (alreadyFavorited != null)
        {
            _dbContext.FavoritedRecipes.Remove(alreadyFavorited);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
        return NotFound();
    }

    [HttpDelete("user/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if(user == null) return NotFound();
        
        // delete all recipes by this user
        var recipes = _dbContext.Recipes.Where(r => r.UserId == user.Id);
        _dbContext.Recipes.RemoveRange(recipes);
        await _dbContext.SaveChangesAsync();

        
        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded) return Ok(new {message = "User Deleted Successfully"});
        
        return BadRequest(result.Errors);
    }
}