using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ServiceFilter(typeof(LogUserActivity))]
[ApiController]
[Route("api/[controller]")] // api/users[Controller]
public class BaseApiController : ControllerBase
{

}

/*
    STUDY NOTES - BaseAPI Controller 
        1. //Base API controller used for DRY (dont repeat yourself)
        2. We can add annothations to expannd the core functionality of our controllers (all the controllers that inherit from the base controller)
            1. [ApiController]
                1. //Handles the API controller functionality and the route configuration 
            2. [Route("api/[controller]")] 
                1. Set a default route for our API
                    1. i.e api/users(userCOntroller)/HttpPut(Update) - user
            3. [ServiceFilter(typeof(LogUserActivity))]
                1. Checks the DI container (Program.cs > ApplicationServicesExtensions.cs) with a configuration that is of type 'LogUserActivity' to load it 
                at the controller.  
                    1. STUDY NOTES - IAsyncActionFilter
        3. Any dependencies in the controller are looked through the DI containter (Program.cs) - i.e. builder.services.AddScoped<>() (ApplicationServicesExtensions.cs)
        to load the data that is going to be used for the session. 
        4. The controller is automatically initialized by the ASP.NET Core 
*/