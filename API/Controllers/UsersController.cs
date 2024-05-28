using System.Security.Claims;
using API.Controllers;
using API.Data;
using API.DTO;
using API.Entities;
using API.Entities.DTO;
using API.Extensions;
using API.Helpers.IPhotoService;
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
    private readonly IPhotoService _photoService;

    /*Dependency Injection
        1. IUserRepository - DB 
        2. IMapper - maps the objects from the client to the DB and viceversa (Helpers > AutoMappersProfile)
        3. IPhotoService - cloduinary service to handle all the submission of photos
    */
    public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
    {
        this._userRepository = userRepository;
        this._mapper = mapper;
        this._photoService = photoService;
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

    [HttpGet("{username}")] // /api/users/username (username parameter) - //api/users/kate
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        /* [Not Needed] Mapping directly in the UserRepository
        var user = await _userRepository.GetUserByUsernameAsync(name);
        var userToReturn = _mapper.Map<MemberDto>(user);
        return Ok(userToReturn);
        */
        return Ok(await _userRepository.GetMemberByUsernameAsync(username));
    }

    [HttpPut] // /api/users
    //GOTO UpdateUser() Notes Below
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
        
        //If the user can update, then the user is successfully authenthicated by the JWT token 

        //Get the username from the JWT claim, which is the first claim registered 
            //(Token Service => new Claim(JwtRegisteredClaimNames.NameId, user.UserName)). The are both "the same" name ID
            //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // => Added in the ClaimsPrincipalExtensions
        var username = User.GetUsername();
        
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

    [HttpPost("add-photo")] //We already had a post above. Thus, need to specify with a route string //api/users/add-photo
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){
        //Get the user stored in the DB
        //Getting the username from our JWT token, logic on ClaimsPrincipalExtensions
        //User comes from the JWT library (Claims) 
        var userFromDB = await _userRepository.GetUserByUsernameAsync(User.GetUsername()); //=> Make sure it is eagerly loading (include), as we need to check the photo count

        //if no user (unlikely) set to not found
        if(userFromDB == null)
            return NotFound();

        //Pass the file from the service to the cloudinary service 
        var result = await _photoService.AddPhotoAsync(file);

        //From the objects that comes from cloudinary, check if there are any errors.
        //Cloudinary does provide information about the current request 
        if(result.Error != null)
            return BadRequest(result.Error.Message);

        
        //Store the data from cloudinary about the photo into our DB. 
        //Create a new photo object (Entities)
        var photo = new Photo{
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        //Check if the user currently does not have any photos in the DB, if they do not, set the photo as main
        if(userFromDB.Photos.Count == 0){
            photo.IsMain = true;
        }
        //Add the photo to the user in the DB
        userFromDB.Photos.Add(photo);

        //Save the changes, otherwise EF wont store the values in the DB yet. 
        //If successful then map the object into a photo DTO and return it
        if(await _userRepository.SaveAllAsync()){
            /*Call another of these end point(Actions) => MORE NOTES ON: OneNote > ASP.NET Core > Controllers 
                to indicate to the user where they can find the information in the site 
                This is for best practice, when we add new elements to the DB, we want to show 
                where the changes were made back to the client. 
                In this case, GET the user of the user that was changed  
                    api/Users/get
                NOTE on CreatedAtAction on the notes below: 
                - nameof() takes a string, it is the best way to avoid magic strings 
                - new {username = userFromDB.UserName} are the parameters taken by the GetUser ActionResult
                - _mapper.Map<PhotoDto>(photo) are the values that are returned back to the client in the body of the request. 
            */
            //Information details of where to find the newly created result (201 created), along with the new resource in the body of the response
            return CreatedAtAction(nameof(GetUser), new {username = userFromDB.UserName}, _mapper.Map<PhotoDto>(photo));
            //return _mapper.Map<PhotoDto>(photo); (OLD- just returning the new photo that was created)
        }
        //If it fails when adding photo in the DB
        return BadRequest("Problem adding photo");
    }
    

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId){
        //Get the user in the claim, to get the user in the DB 
        var userInDb = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        //If the user cant be found
        if(userInDb == null) 
            return NotFound();

        //Check if the DB has a photo with the same ID as the one being passed by the user 
        var clientPhotoInDb = userInDb.Photos.FirstOrDefault(photo => photo.Id == photoId);
        if(clientPhotoInDb == null)
            return NotFound();


        //If the photo is already main, leave as is
        if(clientPhotoInDb.IsMain)
            return BadRequest("This is already your miain photo");

        //Then another photo is main at the moment, set main to false for the current photo, and set the client photo to main
        var currentMainPhotoInDb = userInDb.Photos.FirstOrDefault(photo => photo.IsMain);
        if(currentMainPhotoInDb != null)
            currentMainPhotoInDb.IsMain = false; 
            
        //Set the current client photo to main 
        clientPhotoInDb.IsMain = true; 

        //Save the changes (entitiy framework) to the database, if it can't be saved, then let the client know there has  been a problem
        if(!await _userRepository.SaveAllAsync())
            return BadRequest("Problem setting the main photo");

        //Else return no content (update has been successful)
        return NoContent(); 
    }

    
    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId){
        //Get the user from the DB using the user from the claim
        var userFromDB = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        //No need to check for user, because if the user can delete, it means that the user exists 
        var photo = userFromDB.Photos.FirstOrDefault(p => p.Id == photoId);

        //If the photo is not in the DB, then it does not exist 
        if(photo == null)
            return NotFound();

        //If the photo they are trying to delete is main, do not let them. 
        if(photo.IsMain)
            return BadRequest("You cannot delete your main photo");

        //Check if the photo has a public id, the images stored in cloudinary have them, so if they do not have them, then it is stored locally for tests purposes 
        if(!string.IsNullOrEmpty(photo.PublicId)){
            //Delete the photo from cloudinary
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);
            //If there are any errors, show them back to the user 
            if(result.Error != null){
                return BadRequest(result.Error.Message);
            }
        }
        //Up to this point, it means that everything went well, next is to remove the object from the DB
        userFromDB.Photos.Remove(photo); //=> Entity Framework is tracking the user entity, when doing this, we must save the changes for them to take place in the DB
        
        //save the current instance of entity framework to persist the changes 
        if(await _userRepository.SaveAllAsync())
            return Ok();

        //If the changes were not saved successfully, then return a bad request 
        return BadRequest("Problem deleting photo");
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
                1. User comes from the Claims class, which we get access to when we load the JWT components
                    1. When installing through NuGET the KWT Components 
                    2. This should install the System.Security.Claims namespace
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
