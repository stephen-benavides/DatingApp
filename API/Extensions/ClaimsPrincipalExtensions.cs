using System.Security.Claims;

namespace API.Extensions;
public static class UClaimsPrincipalExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {

        return user.FindFirst(ClaimTypes.Name)?.Value;
    }
    public static int GetUserId(this ClaimsPrincipal user)
    {
        return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }
}

/*
    STUDY NOTES - UClaimsPrincipalExtensions (JWT Token)
        1. Extension method to the ClaimsIdentifier class which contains information of the JWT token that is send to the user when they first log in
        2. Replaces From the UsersController 
        3. Get the username from the JWT claim, which is the first claim registered 
            1. (Token Service => new Claim(JwtRegisteredClaimNames.NameId, user.UserName)). The are both "the same" name ID
                var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        4. As we are using the same string over and over again, it is easier to extend it, for reusability purpose. 
        5. Besides, the main purpose of this extension method is to return the username from the JWT. If in the future it changes, then we only need to do updates in 1 place only
            1. Now we want to get the userId 
        6. We use the TokenService.cs to get a token to the user, this token is a combination of multiple 'calims' with their own identifier
            1. To read this claims, we use the methods on this class 'FindFirst' to get this unique identifiers. 
            2. We also need to map the right keys from the JWTToken the user has and the claim we are trying to identify
                1.  ClaimsPrincipalExtensions.cs (ClaimTypes.Name)) => JwtRegisteredClaimNames.UniqueName
                2.  ClaimsPrincipalExtensions.cs (ClaimTypes.NameIdentifier) => JwtRegisteredClaimNames.NameId
                3. More information on: OneNote > MoreProgramming > ASP.NET CORE > Session VS JWT
*/
