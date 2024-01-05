using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Authentication;
using API.Interfaces;
using API.DTO;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
public class Account : BaseApiController
{
    private readonly DataContext _dataContext;
    private readonly ITokenService _tokenService;

    public Account(DataContext dataContext, ITokenService tokenService)
    {
        this._dataContext = dataContext;
        this._tokenService = tokenService;
    }
    //Register a new user account
    [HttpPost("register")] // api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){
        //Check if the object is not null
        /* No Longer Needed - Validation is implemented in the RegisterDto model object*/
        // if(registerDto.Username == null || registerDto.Password == null){
        //     return BadRequest("Invalid Username or Password");
        // }

        //Check if the user already exists 
        if(await UserExists(registerDto.Username))
            return BadRequest("Username is taken");

        //Hash the password and salt it 
        //Initializing the HASH512 with no parameters, created an automatic 'key' for the hash
        using var hmac = new HMACSHA512(); 
        var hmacPassword = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        var hmacKey = hmac.Key;

        //Map the new user to the data obejct 
        AppUser appUser = new AppUser(){
            UserName = registerDto.Username.ToLower(),
            PasswordHash = hmacPassword,
            PasswordSalt = hmacKey
        };

        //Save the user in the DB 
        _dataContext.Users.Add(appUser);
        await _dataContext.SaveChangesAsync();
        return new UserDto{
            Username = appUser.UserName,
            //To check the token information GOTO: http://jwt.ms/ and paste the token
            Token = _tokenService.CreateToken(appUser)
        };
    }

    private async Task<bool> UserExists(string username){
        return await _dataContext.Users.AnyAsync(u => u.UserName.Equals(username.ToLower()));
    }


    [HttpPost("login")] //api/account/login
    public ActionResult<UserDto> Login(LoginDto userLogin){
        var userInDb = _dataContext.Users.SingleOrDefault(u => u.UserName.Equals(userLogin.Username.ToLower()));
        
        //check if the user exists in the DB 
        if(userInDb == null)
            return Unauthorized("User not found");

        //Compare if the password is correct 
            //Use the salt(key) of the current user in the DB, to rehash the new password from the client and compare if matches 
        using var hmac = new HMACSHA512(userInDb.PasswordSalt);
        var clientHashedPassword = hmac.ComputeHash(Encoding.UTF8.GetBytes(userLogin.Password));

        for (int i = 0; i < clientHashedPassword.Length; i++)
        {
            //If even a single digit in the hash does not match, return 401 exception
            if(clientHashedPassword[i] != userInDb.PasswordHash[i])
                return Unauthorized("Password does not match"); 
        }
        return new UserDto{
            Username = userInDb.UserName,
            Token = _tokenService.CreateToken(userInDb)
        };
    }
}
