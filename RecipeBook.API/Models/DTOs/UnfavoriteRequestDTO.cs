namespace RecipeBook.API.Models;

public class UnfavoriteRequestDTO
{
    public string? UserId { get; set; }
    public int RecipeId { get; set; }
}