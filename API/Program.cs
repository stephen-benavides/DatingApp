using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//Using SQL Lite for the Conenciton 
builder.Services.AddDbContext<DataContext>(opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

//Middleware objects have been removed as not used for this app 

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
