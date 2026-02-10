using System.ComponentModel.DataAnnotations;

namespace RecipeBook.API.Models;

public class RecipeUpdateDTO
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Category { get; set; }
    [Required]
    public string Area { get; set; }
    public string? Description { get; set; }
    public string? Source { get; set; }
    public string? Youtube { get; set; }
    public string? Instructions { get; set; }

    public IFormFile? ImageFile { get; set; }

    public List<IngredientDTO> Ingredients { get; set; } = new();

}