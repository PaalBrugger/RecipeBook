namespace RecipeBook.API.Models;

public class Ingredient
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Measure { get; set; }
    
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }

    
}