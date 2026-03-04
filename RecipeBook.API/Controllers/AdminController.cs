using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBook.API.Database;
using RecipeBook.API.Models;

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
    public async Task<IActionResult> UpdateUser(UserDTO userDto)
    {
        return Ok();
    }

    [HttpDelete("user/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        return Ok();
    }
}