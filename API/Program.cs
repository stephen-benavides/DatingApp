using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//Using SQL Lite for the Conenciton for our DataContext (EF DataContext Configuration)
builder.Services.AddDbContext<DataContext>(option => 
{
    option.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Adding Custom Services (API/Externsions/ApplicationServicesExtensions)
builder.Services.AddCustomApplicationServices(builder.Configuration);

/*** MIDDLEWARE AREA AFTER BUILDING THE SERVICES ******/
var app = builder.Build();

//Adding the exception middleware to handle any errors during execution 
app.UseMiddleware<ExceptionMiddleware>();

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

#region STUDY NOTES - Populating the users table with seed data (JSON Generator) at runtime. 
/*
    - Place this code between MapControllers and before app.Run()

    Creating DI Scope Manually - that will maintain the state of the service while the application is active 
    Get a new scope of all the services to be added to the application, dependency injection (DI) 
        CreateScope() is a method called on an IServiceScopeFactory to manually create a new DI scope for resolving services. 
            It's used at runtime, typically in background tasks or services, to obtain scoped services.
        AddScoped() is a method called on an IServiceCollection during application startup to register services with a scoped lifetime. 
            It defines how the DI container should manage the lifetime of these services, ensuring they are created once per request.
*/
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    //create a new instance of the EF custom data context class 
    var context = services.GetRequiredService<DataContext>();
    //To run this, drop the current DB. MigrateAsync() will create a new db with the migrations currently in the system.
    await context.Database.MigrateAsync();
    //Invoke our seed class to load the new data into newly created users table 
    await Seed.SeedUsers(context);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error ocurred during migration");
}

#endregion


app.Run();
