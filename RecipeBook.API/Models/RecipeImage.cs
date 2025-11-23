namespace RecipeBook.API.Models;

public class RecipeImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }

    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }
}