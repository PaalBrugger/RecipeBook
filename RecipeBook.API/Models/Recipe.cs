namespace RecipeBook.API.Models;

public class Recipe
{
    public int Id { get; set; }
    public string MealDBId { get; set; } // from TheMealDB
    public DateTime? ModifiedAt { get; set; }
    public string Name { get; set; }
    public string? Category { get; set; }
    public string? Area { get; set; }
    public string? Instructions { get; set; }
    public string? MainImageUrl { get; set; }
    public string? Description { get; set; }
    public string? Source  { get; set; }
    public string? Youtube  { get; set; }
    
    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public ICollection<RecipeImage> ImageGallery { get; set; }
    public ICollection<Ingredient> Ingredients { get; set; }


    public ICollection<FavoritedRecipe> FavoritedByUsers { get; set; }
}