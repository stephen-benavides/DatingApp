using System.Security.Claims;
using API.Controllers;
using API.Data;
using API.DTO;
using API.Entities;
using API.Entities.DTO;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;
[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        this._userRepository = userRepository;
        this._mapper = mapper;
    }

    /*
        Async code
        1. set the method signature with async and Task<>
        2. the code needs to implement async method - look for the usaual method you want to implement followed by Async (ToListAsync())
        2. async method that are implemented requiere tue await keyword 
    */
    //[AllowAnonymous] /*Active for testing purposes*/
    [HttpGet] // /api/users
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        /* [Not Needed] Mapping directly in the UserRepository
        //Get the user from the DB
        var users = await _userRepository.GetUsersAsync(); 
        //Map the users in the DB with the users to be returned - MemberDto
        var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
        
        return Ok(usersToReturn);
        */
        return Ok(await _userRepository.GetMembersAsync());
    }

    /*
    [HttpGet("{id}")] // /api/users/2
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        return Ok(await _userRepository.GetUserByIdAsync(id));
    }
    */

    [HttpGet("{name}")] // /api/users/name
    public async Task<ActionResult<MemberDto>> GetUser(string name)
    {
        /* [Not Needed] Mapping directly in the UserRepository
        var user = await _userRepository.GetUserByUsernameAsync(name);
        var userToReturn = _mapper.Map<MemberDto>(user);
        return Ok(userToReturn);
        */
        return Ok(await _userRepository.GetMemberByUsernameAsync(name));
    }

    [HttpPut] // /api/users
    //GOTO UpdateUser() Notes Below
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
        
        //If the user can update, then the user is successfully authenthicated by the JWT token 

        //Get the username from the JWT claim, which is the first claim registered 
            //(Token Service => new Claim(JwtRegisteredClaimNames.NameId, user.UserName)). The are both "the same" name ID
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        //With the username we can now get the user from the DB to update it
        var userFromDB = await _userRepository.GetUserByUsernameAsync(username);
        //If the user does not exist
        if(userFromDB == null)
            return NotFound();
        

        //If the user exist, map our memberdto to the userFromDB 
        //This will automatically overwrite all the changes into the user from the DB
        _mapper.Map(memberUpdateDto, userFromDB);
        
        //SaveAllAsync() will return true if the update to the DB was successfull
        if(await _userRepository.SaveAllAsync())  
            return NoContent(); //Standard for successful "update" HTTP code (204)

        //else the entire thing failed
        return BadRequest("Failed to update user");

    }
    

    /* STUDY NOTES - Using [Authorize] and [AllowAnonymous] for authenthication and authorization
        [AllowAnonymous] bypasses authorization statements. 
        If you combine [AllowAnonymous] and an [Authorize] attribute, the [Authorize] attributes are ignored.


        STUDY NOTES - Mapper Implementation in Controller
            1. Getting the automapper packages from nuget and setting up the automapper profiler and classes 
                1. GOTO Helpers > AutoMapperProfiles 
                2. GOTO Entities > DTO > MemberDto
            2. Setting the automapper on Program.cs 
                1. This is done in this project by setting the Extensions > ApplicationServicesExtensions 
                2. Create a new map (method) AddAutoMapper() 
            3. THIS CLASS
                1. Inject the mapper interface (IMapper) in the constructor of the target controller 
                2. use the method from the inerface: Map<TReturn>(TSource); 
                    - WHERE: 
                        - TReturn is the data to return - the MembetDto
                        - TSource is the input data, the data from the server itself 
                3. Change the type on the method signature: public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
                    1. As you are no longer returning an AppUser, you must change to reflect the new data 
                    2. In this case a MemberDto type 

        STUDY NOTES - SQL SERVER PROFILER 
            1. To check at run time without having to use SQL Server Profiler
            2. Invoke your controller that is implementing the query
            3. Check the TERMINAL where your API is running 
            4. There you will see how EF is interpreting your query, the same way is done by the SQL Server Profiler (OneNote > EF > Querying using LINQ)

        STUDY NOTES - UpdateUser() 
            1. This method is of type put, as we are updating a user 
            2. We do not need to return anything else to the user, thus only an Action Result will sufice 
            3. The user that can update a member must be logged in. Thus, they have a valid bearer token. 
                The token contains information about the user such as the username, so we can use it to authenthicate the request and update the necessary information 
                1. User comes from the Claims class, which we get access to when we load the KWT components
                2. GOTO Services > TokenService.cs

            TESTING THIS METHOD
                1. In postman, make sure you are getting a valid bearer token with the username you want to update 
                    1, Go to Section 8 > Login as Lisa and save token to environment 
                    2. Then you can go to 10, and update the member with the saved bearer token 
                2. Entity Framework, checks all the changes made through their own data caching, therefore if no "new" changes are made, then it won't go through the DB
                    So in this code, even if you are authenthicated succesfully and hit the "save" button, it will still fail and return BadRequest("Failed to update user"); 
                    as no "new changes" will be made

    */
}
