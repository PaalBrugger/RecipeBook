namespace RecipeBook.API.Models;

public class FavoritedRecipe
{
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }

    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }

    public DateTime FavoritedAt { get; set; } = DateTime.UtcNow;
}