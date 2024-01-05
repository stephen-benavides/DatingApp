using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//Using SQL Lite for the Conenciton 
builder.Services.AddDbContext<DataContext>(opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Adding Custom Services 
builder.Services.AddCustomApplicationServices(builder.Configuration);

/*** MIDDLEWARE AREA AFTER BUILDING THE SERVICES ******/
var app = builder.Build();

/*Middleware needs to be installed in a particular order, else there can be potential issues */
    /*Adding cross domain requests
        * Allow any request headers 
        * Allow Any method (post, put, delete)
        * From the origin (http) that is usisng our application 
    */ 
app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

//app.UseHttpsRedirection();

//These middleware must be in order
/*
    Before it hits the controller, but after it hits the cross origin request to access our server
    Authenthicate: Make sure the credentials are valid 
    Authorize: After making sure the credentials are valid, check if the user is allowed in the requested site 
        ** These 2 are loaded for the usage of the JWT Web Token Authenthication Bearer to get access to the controllers  
*/
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
