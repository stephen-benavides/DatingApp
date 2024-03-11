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
    */
}
