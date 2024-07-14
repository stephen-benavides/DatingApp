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
using AutoMapper;

namespace API.Controllers;
public class AccountController : BaseApiController
{
    private readonly DataContext _dataContext;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountController(DataContext dataContext, ITokenService tokenService, IMapper mapper)
    {
        this._dataContext = dataContext;
        this._tokenService = tokenService;
        this._mapper = mapper;
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

        //From the register dto map the elements to the appUser we are going to be using 
        var user = _mapper.Map<AppUser>(registerDto);

        //Hash the password and salt it 
        //Initializing the HASH512 with no parameters, created an automatic 'key' for the hash
        using var hmac = new HMACSHA512(); 
        var hmacPassword = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        var hmacKey = hmac.Key;

        //Map the new user to the data obejct 
        /*
        //This snippet has been replaced, and now instead of the appUser directly, we are using the automapper (user)
        AppUser appUser = new AppUser(){
            UserName = registerDto.Username.ToLower(),
            PasswordHash = hmacPassword,
            PasswordSalt = hmacKey
        };
        */
        user.UserName = registerDto.Username.ToLower();
        user.PasswordHash = hmacPassword;
        user.PasswordSalt = hmacKey;
        

        //Save the user in the DB 
        _dataContext.Users.Add(user);
        await _dataContext.SaveChangesAsync();
        return new UserDto{
            Username = user.UserName,
            //To check the token information GOTO: http://jwt.ms/ and paste the token
            Token = _tokenService.CreateToken(user),
            KnownAs = user.KnownAs
        };
    }

    private async Task<bool> UserExists(string username){
        return await _dataContext.Users.AnyAsync(u => u.UserName.Equals(username.ToLower()));
    }


    [HttpPost("login")] //api/account/login
    public ActionResult<UserDto> Login(LoginDto userLogin){
        var userInDb = _dataContext.Users.Include(photo => photo.Photos).SingleOrDefault(u => u.UserName.Equals(userLogin.Username.ToLower()));
        
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
            Token = _tokenService.CreateToken(userInDb),
            PhotoUrl = userInDb.Photos.SingleOrDefault(photo => photo.IsMain)?.Url, //=> There may or may not be a photo when the user first logins into the application
            /*PhotoUrl is a related entity, it means that it has a reference in user only.
            Thus, we must eagerly loaded, as it is required bby entity framework  
                1. To make it so it is eagerly loaded, use the .include() in the request - line67. To load the related object of Photos
                2. More notes on eagerly loaded objects using entity framework on OneNote > EntitiyFramework > Section 7 
                3. Remember, EF does not load related entities by default
            */
            KnownAs = userInDb.KnownAs
        };
    }
}
