namespace RecipeBook.API.Models;

public class RecipeDTO
{
    public int Id { get; set; }
    public DateTime? ModifiedAt { get; set; }
    public string Name { get; set; }
    public string? Area { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public string? MainImageUrl { get; set; }
    public string? Source  { get; set; }
    public string? Youtube  { get; set; }
    public string? UserId { get; set; }
    
    public string? UserName { get; set; }
    
    public List<IngredientDTO> Ingredients { get; set; }
}