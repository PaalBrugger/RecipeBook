using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RecipeBook.API.Models;

namespace RecipeBook.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _config;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
        IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO model)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            
            return BadRequest(new{errors});
        }
        var user = new ApplicationUser
        {
            UserName = model.Username, Name = model.Name, Email = model.Email, City = model.City,
            Country = model.Country, PostalCode = model.PostalCode
        };
        var existingUsername = await _userManager.FindByNameAsync(model.Username);
        if (existingUsername != null)  return BadRequest("Username already exists");
        
        var result = await _userManager.CreateAsync(user, model.Password);
        
        if (!result.Succeeded) return BadRequest(result.Errors);
        
        return Ok(new { message = "User registered  successfully" });
    }

    [HttpPost("check-username")]
    public async Task<IActionResult> CheckUsername([FromBody] string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Ok(new { available = true });
        }
        else
        {
            return Conflict(new { available = false, message = "Username is already taken." });
        }
        
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),                
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        return Unauthorized();
    }
}