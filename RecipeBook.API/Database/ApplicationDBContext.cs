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
    public DbSet<FavoritedRecipe> FavoritedRecipes { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Composite key for Favorited Recipe
        builder.Entity<FavoritedRecipe>()
            .HasKey(sr => new { sr.UserId, sr.RecipeId });

        builder.Entity<FavoritedRecipe>()
            .HasOne(sr => sr.User)
            .WithMany(u => u.FavoritedRecipes)
            .HasForeignKey(sr => sr.UserId);

        builder.Entity<FavoritedRecipe>()
            .HasOne(sr => sr.Recipe)
            .WithMany(r => r.FavoritedByUsers)
            .HasForeignKey(sr => sr.RecipeId);
        
        builder.Entity<Recipe>()
            .HasOne(r => r.User)
            .WithMany(u => u.CreatedRecipes)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}