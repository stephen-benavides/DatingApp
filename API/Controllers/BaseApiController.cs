using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

//Base API controller used for DRY (dont repeat yourself)
//Handles the API controller functionality and the route configuration 
[ApiController]
[Route("api/[controller]")] // api/users[Controller]
public class BaseApiController : ControllerBase
{

}
