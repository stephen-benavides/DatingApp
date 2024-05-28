using System.Security.Claims;

namespace API.Extensions;
public static class UClaimsPrincipalExtensions
{
    public static string GetUsername(this ClaimsPrincipal user){

        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}

/*
    - Replaces From the UsersController 

    //Get the username from the JWT claim, which is the first claim registered 
            //(Token Service => new Claim(JwtRegisteredClaimNames.NameId, user.UserName)). The are both "the same" name ID
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;


    - As we are using the same string over and over again, it is easier to extend it, for reusability purpose. 
    Besides, the main purpose of this extension method is to return the username from the JWT. If in the future it changes, then we only need to do updates in 1 place only
*/
