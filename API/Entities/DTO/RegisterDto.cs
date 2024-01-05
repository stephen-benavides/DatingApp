using System.ComponentModel.DataAnnotations;

namespace API.Entities.DTO;
public class RegisterDto
{
    /*
        You can set validation before hitting the controller 
        by the parameters that is binded in the controller 
        thanks to the [ApiController] attribute implemented 
        in the BaseApiController class.

        This allows to bypass changes to the DB Schema  
    */
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    
}
