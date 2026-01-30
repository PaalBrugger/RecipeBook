using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecipeBook.API.Database;
using RecipeBook.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDBContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:4173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddHttpClient<MealDBImporter>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDBContext>();
    
    context.Database.Migrate();

    if (!context.Recipes.Any())
    {
        var importer = services.GetRequiredService<MealDBImporter>();
        await importer.ImportMealsAsync("Beef");
        await importer.ImportMealsAsync("Breakfast");
        await importer.ImportMealsAsync("Chicken");
        await importer.ImportMealsAsync("Dessert");
        await importer.ImportMealsAsync("Goat");
        await importer.ImportMealsAsync("Lamb");
        await importer.ImportMealsAsync("Pasta");
        await importer.ImportMealsAsync("Pork");
        await importer.ImportMealsAsync("Seafood");
        await importer.ImportMealsAsync("Side");
        await importer.ImportMealsAsync("Starter");
        await importer.ImportMealsAsync("Vegan");
        await importer.ImportMealsAsync("Vegetarian");
        await importer.ImportMealsAsync("Miscellaneous");
        
        Console.WriteLine("Imported MealDB recipes into database!");
    }
    else
    {
        Console.WriteLine("Recipes already exist — skipping import.");

    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseCors("AllowReactApp");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();
app.Run();

