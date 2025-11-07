using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RecipeBook.API.Models;

namespace RecipeBook.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserController(UserManager<ApplicationUser> userManager)
    {
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
}