using API.Data;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class BuggyController : BaseApiController
{
    private readonly DataContext _dataContext;

    public BuggyController(DataContext dataContext)
    {
        this._dataContext = dataContext;
    }

    [Authorize]
    [HttpGet("auth")] //localhost:XX/api/buggy/auth
    public ActionResult<string> GetSecret(){
        return "secret text";
    }

    [HttpGet("not-found")] //localhost:XX/api/buggy/not-found
    public ActionResult<AppUser> GetNotFound(){
        //cant find user -1, this will return error. 
        var thing = _dataContext.Users.Find(-1); 
        if(thing == null)
            return NotFound();
        
        return thing;
    }

    [HttpGet("server-error")] //localhost:XX/api/buggy/server-error
    public ActionResult<string> GetServerError(){
        var thing = _dataContext.Users.Find(-1); 
        
        /*
            try
            {
                
                //  Can't convert null to string, this will throw an exception (Null Reference Exception)
                //  Null Reference Exceptions are common when not coding defensively
                
                var thingToReturn = thing.ToString();
                return thingToReturn;
            }
            catch (Exception ex)
            {
                //If there is an error, return error code 500, and the message with the error
                return StatusCode(500, ex.Message);
            }
        */

        /*
            Can't convert null to string, this will throw an exception (Null Reference Exception)
            Null Reference Exceptions are common when not coding defensively
        */
        var thingToReturn = thing.ToString();
        return thingToReturn;

        
    }

    [HttpGet("bad-request")] //localhost:XX/api/buggy/bad-request
    public ActionResult<string> GetBadRequest(){
        return BadRequest("This was not a good request");
    }

    /* BAD IDEA TO HAVE ANOTHER ENTRY POINT TO THE APPLICATION, USING THE ONE IN THE ACCOUNT CONTROLLER INSTEAD
        [HttpPost("register")] //localhost:XX/api/buggy/register
        public ActionResult<string> GetValidationError(RegisterDto registerUser){
            return "Valid User";
        }
    */
}


/* STUDY NOTES
Buggy Controller 
    1. works as a main repository to handle errors and exception in the code 
    2. remember to use try/catch/block if requiered
        1. OR, asp.net CORE allows to handle the errors in higher level (Program.cs)
        2. Add the service as a middleware in program.cs 

*/