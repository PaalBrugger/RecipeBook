using Microsoft.AspNetCore.Identity;


namespace RecipeBook.API.Models;

public class ApplicationUser : IdentityUser

{
    public string name { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    
    // Navigation property for saved recipes
    public ICollection<SavedRecipe> SavedRecipes { get; set; }
    
}