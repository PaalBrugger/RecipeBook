namespace RecipeBook.API.Models;

public class RegisterDto
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string PostalCode { get; set; }
    public string Password { get; set; }
    
}