namespace RecipeBook.API.Models;

public class UnfavoriteRequest
{
    public string? UserId { get; set; }
    public int RecipeId { get; set; }
}