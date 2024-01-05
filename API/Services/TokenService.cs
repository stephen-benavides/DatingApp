using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers.Services;
/// <summary>
/// Service for the JWT Token Creation 
/// </summary>
public class TokenService : ITokenService
{

    /*
        Symmetric key 
            - Used to indicate the element will only be encrypted and decypted by the server, not the user 
        Asymmetric key
            - Used to indicate that the client can also decrypt the key from their end 
    */
    private readonly SymmetricSecurityKey _key;

/// <summary>
/// Service for the JWT Token Creation 
/// </summary>
/// <param name="config">Takes the key from the config file</param>
    public TokenService(IConfiguration config)
    {
        //Adding a new key from the web config 
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }
    public string CreateToken(AppUser user)
    {
        //Initialize a nenw claim - the JWT implementations comes from the - System.IdentityModel.Token.Jwt package - from nuget 
        var claims = new List<Claim>(){
            //Every request must be surrounded in a claim to be added as a subject in the request, we can add more to it later 
            //This reflects what the user is claiming themselves to be 
            new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
        };
        //Credentials - certificate with the summetric key that will be used to encrypt the request 
        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        //actual token that is send to the client with the 3 headers 
        var tokenDescriptor = new SecurityTokenDescriptor{
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(27), //Debug purposes
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
