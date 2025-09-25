namespace RecipeBook.API.Models;

public class SavedRecipe
{
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }

    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }

    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}