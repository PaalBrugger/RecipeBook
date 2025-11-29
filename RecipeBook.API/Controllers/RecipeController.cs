using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RecipeBook.API.Database;
using RecipeBook.API.Models;

namespace RecipeBook.API.Controllers;

public class RecipeController : ControllerBase
{
    private ApplicationDBContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;


    public RecipeController(ApplicationDBContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }
}