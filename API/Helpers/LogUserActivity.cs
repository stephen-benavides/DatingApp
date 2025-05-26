using System;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // We want to get the values AFTER the API action has completed 
        var resultContext = await next();

        //We want to make sure the user has been authenthicated first. 
        if (!resultContext.HttpContext.User.Identity.IsAuthenticated)
            return;

        //using our custom extension method for the HttpContext to get the userId from the JWT Token
        var userId = resultContext.HttpContext.User.GetUserId();

        //Invoked the UserRepository Services with the user's identity to update the 'LastActive' property
        var userRepository = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
        var user = await userRepository.GetUserByIdAsync(userId);
        user.LastActive = DateTime.UtcNow;
        await userRepository.SaveAllAsync();
    }

}


/*
    STUDY NOTES - IAsyncActionFilter
        1. Do we want to process someting before the action or after the action 
        2. This interface allows to have access to 
            1. ActionExecutingContext context
                1. By using the context we get to 'inercept' the action before it runs the API call. 
            2. ActionExecutionDelegate next
                1. By using the next() delegate, we invoked the ActionExecutEDDelegate which grants us access AFTER executing the API action.
                
        3. We get access to any operation within the API thanks to the 'context' by using methods such as GetRequiredService, which invokes a service in our API. 
            1. In this case we want to get access to a DAL of our UserRepository 
            2. As the user is authenthicated, we can use their information from the current request to access data outside the scope by using their identifiers. 
                1. i.e. By using the username, we can get access to ANY object in the API 

*/