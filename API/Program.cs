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
//Adding CORS certificate so the request can be access by angular (other http protocol besides the one the application is built on)
builder.Services.AddCors();

var app = builder.Build();

/*Middleware needs to be installed in a particular order, else there can be potential issues */
    /*Adding cross domain requests
        * Allow any request headers 
        * Allow Any method (post, put, delete)
        * From the origin (http) that is usisng our application 
    */ 
app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

//app.UseHttpsRedirection();
//
//app.UseAuthorization();

app.MapControllers();

app.Run();
