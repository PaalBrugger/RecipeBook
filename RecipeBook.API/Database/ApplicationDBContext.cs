using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RecipeBook.API.Models;

namespace RecipeBook.API.Database;

public class ApplicationDBContext :  IdentityDbContext <ApplicationUser> 
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
        
    }
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Composite key for SavedRecipe
        builder.Entity<SavedRecipe>()
            .HasKey(sr => new { sr.UserId, sr.RecipeId });

        builder.Entity<SavedRecipe>()
            .HasOne(sr => sr.User)
            .WithMany(u => u.SavedRecipes)
            .HasForeignKey(sr => sr.UserId);

        builder.Entity<SavedRecipe>()
            .HasOne(sr => sr.Recipe)
            .WithMany(r => r.SavedByUsers)
            .HasForeignKey(sr => sr.RecipeId);
    }
}