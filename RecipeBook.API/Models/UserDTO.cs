namespace RecipeBook.API.Models;

public class UserDTO
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? PhoneNumber { get; set; }
    
    public List<RecipeSummaryDTO> FavoritedRecipes { get; set; } = new List<RecipeSummaryDTO>();
    
    public List<RecipeSummaryDTO> CreatedRecipes { get; set; } = new List<RecipeSummaryDTO>();
}