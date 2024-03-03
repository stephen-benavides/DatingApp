using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        this._next = next;
        this._logger = logger;
        this._env = env;
    }

    public async Task InvokeAsync(HttpContext context){
        try
        {
            //If the code is fine, then just move on to the next middleware.
            await _next(context);
        }
        catch (Exception ex)
        {
            //If there are any errors, THEN log the errors
            _logger.LogError(ex, ex.Message);

            //Build the response to send to the client
            context.Response.ContentType = "application/json"; //Done By Default by the Controller
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            //If environment is deployment, create a new object with extensive stack trace, else only minimal information to the client 
            var response = (_env.IsDevelopment()) 
            ? new ApiException(StatusCode: context.Response.StatusCode, Message: ex.Message, Details: ex.StackTrace?.ToString()) 
            : new ApiException(StatusCode: context.Response.StatusCode, Message: ex.Message, Details: "Internal Server Error"); 

            //By Default by the controller, this makes sure the message display to the user is in camel case 
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            var json = JsonSerializer.Serialize(response, options);

            //Submit the json with the logging information to the client 
            await context.Response.WriteAsync(json);
        }
    }

    /*
        STUDY NOTES
            1. This is use as a middle ware to catch all the exceptions at the highest levels 
            2. By setting the try/catch block here, we avoid having to set the try/catch block on each individual controller 
            3. Implementation
                1. Add the middleware in Program.cs
                2. Needs to be added at the very beggining of the middlewares in Program.cs 
                3. Above app.UseCors()
                4. app.UseModdleware<NameOfThisException>
                    1. This is why the method signature (public async Task InvokeAsync(HttpContext context){}) is a MUST
                    2. Otherwise it wont be recognized, therefore it wont be executed 
            4. Dependencies
                1. RequestDelegate (class)
                    1. Indicates the completion of an http request 
                    2. If there arent any errors, then move to the next request, that's why (next)
                2. ILogger
                    1. Injected interface that we can integrate in the services
                    2. Use to log the errors outisde in other media outside of the request 
                    3. Implemented at the beggining to any errors would get logged prior to HTTP communications 
                    4. dependency injection, set in Program.cs 
                3. IHostEnvironment
                    1. Gives us access to the environment that the application is currently running on 
                    2. The environment is set in Properties => launchSettings.json => ASPNETCORE_ENVIRONEMNT

            6. METHODS:
                1. InvokeAsync() 
                    1. Method that is a must 
                    2. Think of it as an overwritten method 
                    3. It is used so the middleware knows the method to invoke 
                    4. It searches for this method to run your custom code
                    5. If this does not exist, or is not written correctly, then it won't run 
    */
}
