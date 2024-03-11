using System.Text;
using API.Controllers.Services;
using API.Data;
using API.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;
public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddCustomApplicationServices(this IServiceCollection services, ConfigurationManager configuration){

        /*
        * Adding Services is akin to 
        * letting the application know about 
        * loading resources for your custom services. 
        * To actually loading said services, 
        * you must add the middleware requiere in a specific order. 
        * Else it wont work. 
        * The services themselves can be on any order whatsoever. The middleware CAN NOT. 
        */

        #region Cross Origin Resource Sharing
        //Adding CORS certificate so the request can be access by angular (other http protocol besides the one the application is built on)
        services.AddCors();
        #endregion

        #region Dependency Injection
        /*
            - Based on how long we requiere the service to last 
                * Transient 
                * Scoped
                * Singleton
            - GOTO => NOTES BELOW 
        */
        //Initializing the instannce of our token as TokenService for the utilization of the token in our controller 
        services.AddScoped<ITokenService, TokenService>();
        //Initialzing our user Repository 
        services.AddScoped<IUserRepository, UserRepository>();
        //Initializing our automapper, need to tell where our mappers are 
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        #endregion
        
        #region JWT Token Authentication Service
        /*
        Adding the middleware services requiered to authenthicate JWT tokens.
        The services can be in any order. But the actual middle ware -> below app-- like app.useAhorization() must be in a particular order,
        otherwise it will stop before getting into yoour logic if the order is not right 
            Nuget- Microsoft.AspNetCore.Authentication.JwtBearer by Microsoft
        */
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options => 
        {
            options.TokenValidationParameters = new TokenValidationParameters(){
                /*List of all thhe rules our service will use to authenticate the JWT token */
                    
                //Our service will check the token key and make sure is valid - token has been signed by the issuer 
                ValidateIssuerSigningKey = true,
                //Check the issuer's key (our key) is the same that the one that we are retrieving from the JWT 
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"])),
                //Issuer of the token is the API server, but we need to pass the info down in the token 
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });
        #endregion
        

        return services;

    }
}


/*STUDY NOTES - Custom Extension Method to apply custom services into Program.cs

    - To create a Jason Web Token (JWT) for authenthication and authorization 
    - Add authenthication and authorization variables 
    - Adding custom depenency Injection 
        - Transient 
            - Transient lifetime services are created each time they are requested from the service container. This lifetime works best for lightweight, stateless services.
            - WHEN TO USE: 
                * For services that are stateless and do not hold any data or state between requests.
                * When you need a separate instance of a service every time it's injected.
                * Examples include services that provide calculation utilities or simple functions.

        - Scoped 
            - Scoped lifetime services are created once per client request (connection). This means that a single instance is used throughout the request and then discarded.
            - WHEN TO USE: 
                * For services that need to maintain state within a single request.
                * When you need to share data between components within the same HTTP request.
                * Examples include database context instances in EF Core, user session services, or anything that needs to be consistent throughout a single request but not beyond.
        
        - Singleton 
            - Singleton lifetime services are created the first time they are requested 
            - (or when Startup.ConfigureServices runs if you specify an instance there) 
            - and then every subsequent request will use the same instance. 
            - If your application requires a single instance of a service throughout the application's lifetime, 
            - singleton is the appropriate choice.
            - WHEN TO USE: 
                * For services that are expensive to create and can be safely used by concurrent HTTP requests.
                * When you need a service to maintain state throughout the life of the application or share data across requests.
                * Examples include configuration services, caching services, and logging services.

        NOTE: Selecting the correct service lifetime 
            depends on the specific use case within your application. 
            It's important to choose carefully to avoid unnecessary memory use, 
            potential memory leaks, or issues with concurrency. Here are a few guidelines:
                * Use transient services for lightweight, stateless services.
                * Use scoped services for services that need to maintain state or data within an individual request.
                * Use singleton services for application-wide services that need to maintain state or data throughout the life of the application and can be shared across multiple requests.

    - Cross Origin Resource Identifier (CORS)

    - AutoMapper 
        - services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        - We only have 1 mapper into this project, but the method does not take an empty parameter
        - AppDomain.CurrentDomain.GetAssemblies()
            - This makes sure we are getting the threads from the current domain only
            - It is standard IF you are only using one single place for the automapper 
            - In this case the siingle place is Helpers > AutoMapperProfiles 
    */
