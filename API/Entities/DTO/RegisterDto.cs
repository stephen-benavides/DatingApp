using System.ComponentModel.DataAnnotations;

namespace API.Entities.DTO;
public class RegisterDto
{
    
    [Required]
    public string Username { get; set; }
    [Required]
    [StringLength(maximumLength: 8, MinimumLength = 4)]
    public string Password { get; set; }
    

    /* STUDY NOTES - User DTO that handles client communication without exposing the DATA classes, uses DataModel convention attributes
        You can set validation before hitting the controller 
        by the parameters that is binded in the controller 
        thanks to the [ApiController] attribute implemented 
        in the BaseApiController class.

        This allows to bypass changes to the DB Schema  

        - Changes to the controller, requieres physically reseting the services and running them aggain (dotnet watch --no-hot-reload)

        ATTRIBUTES: 
            - [Requiered]
                - Here we are going to check if the username is requiered by using the [Requiered] attribute
                - This has to do the with the validity of the model (asp.net MVC)

            - [StringLength]
                - Make sure the object in the model if a certain maximum length 
                - You can also set a minimum length property to indicate the minimum length allowed 
        
    */
}
