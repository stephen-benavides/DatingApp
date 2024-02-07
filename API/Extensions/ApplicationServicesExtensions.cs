using System.Text;
using API.Controllers.Services;
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
        //Initializing the instannce of our token as TokenService for the utilization of the token in our controller 
        /*
            - Based on how long we requiere the service to last 
            Transient 
            Scoped
            Singleton
        */
        services.AddScoped<ITokenService, TokenService>();
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
