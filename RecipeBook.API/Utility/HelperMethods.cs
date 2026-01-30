namespace RecipeBook.API.Utility;

public class HelperMethods
{
    public static async Task<string> SaveImageAsync(IFormFile file)
    {
        if (!file.ContentType.StartsWith("image/"))
            throw new Exception("Invalid file type");

        if (file.Length > 5 * 1024 * 1024)
            throw new Exception("File too large");

        var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "recipes");
        Directory.CreateDirectory(uploadsRoot);

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        // return URL the frontend can use
        return $"/uploads/recipes/{fileName}";
    }

}