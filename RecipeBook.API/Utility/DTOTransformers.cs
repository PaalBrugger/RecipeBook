using RecipeBook.API.Models;

namespace RecipeBook.API.Utility;

public static class DTOTransformers
{
    public static RecipeDTO CreateRecipeDTO(Recipe recipe)
    {
        var dto = new RecipeDTO()
        {
            Id = recipe.Id,
            Name = recipe.Name,
            Area = recipe.Area,
            Category = recipe.Category,
            Instructions = recipe.Instructions,
            MainImageUrl = recipe.MainImageUrl,
            Source = recipe.Source,
            Youtube = recipe.Youtube,
            Ingredients = recipe.Ingredients
                .Select(i => new IngredientDTO
                {
                    Id = i.Id,
                    Name = i.Name,
                    Measure = i.Measure
                }).ToList()
        };
        
        return dto;
    }
    public static List<RecipeDTO> CreateRecipeDTOList(List<Recipe> recipes)
    {
        var dto = new List<RecipeDTO>();

        foreach (var recipe in recipes)
        {
            dto.Add(new RecipeDTO
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Area = recipe.Area,
                Category = recipe.Category,
                Instructions = recipe.Instructions,
                MainImageUrl = recipe.MainImageUrl,
                Source = recipe.Source,
                Youtube = recipe.Youtube,
                Ingredients = recipe.Ingredients
                    .Select(i => new IngredientDTO
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Measure = i.Measure
                    }).ToList()
            });
        }

        return dto;
    }


}