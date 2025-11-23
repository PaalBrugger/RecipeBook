using RecipeBook.API.Models;

namespace RecipeBook.API.Database;

public class MealDBImporter
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDBContext _dbContext;
    
    public MealDBImporter(HttpClient httpClient, ApplicationDBContext dbContext)
    {
        _httpClient = httpClient;
        _dbContext = dbContext;
    }

    public async Task ImportMealsAsync(string category)
    {
        var response =
            await _httpClient.GetFromJsonAsync<MealDbresponse>(
                $"https://www.themealdb.com/api/json/v1/1/filter.php?c={category}");
        
        foreach (var meal in response.Meals)
        {
            var detailResponse = await _httpClient.GetFromJsonAsync<MealDetailResponse>(
                $"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal.IdMeal}");
            var detail = detailResponse.Meals.First();

            if (!_dbContext.Recipes.Any(r => r.MealDBId == detail.IdMeal))
            {
                var recipe = new Recipe
                {
                    MealDBId = detail.IdMeal,
                    Name = detail.StrMeal,
                    Category = detail.StrCategory,
                    Area = detail.StrArea,
                    Instructions = detail.StrInstructions,
                    MainImageUrl = detail.StrMealThumb,
                    Ingredients = GetIngredients(detail),
                    Source = detail.StrSource,
                    Youtube = detail.StrYoutube
                };
        _dbContext.Recipes.Add(recipe);
        await _dbContext.SaveChangesAsync();
            }
        }

    }
    private List<Ingredient> GetIngredients(MealDetail detail)
    {
        var ingredients = new List<Ingredient>();

        for (int i = 1; i <= 20; i++)
        {
            var name = (string)detail.GetType().GetProperty($"StrIngredient{i}")?.GetValue(detail);
            var measure = (string)detail.GetType().GetProperty($"StrMeasure{i}")?.GetValue(detail);

            if (!string.IsNullOrWhiteSpace(name))
            {
                ingredients.Add(new Ingredient { Name = name.Trim(), Measure = measure?.Trim() });
            }
        }

        return ingredients;
    }
    
}