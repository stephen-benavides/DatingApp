using System.ComponentModel.DataAnnotations;

namespace API.Entities.DTO;
public class RegisterDto
{
    
    [Required]
    public string Username { get; set; }

    [Required]
    [StringLength(maximumLength: 8, MinimumLength = 4)]
    public string Password { get; set; }

    //Adding more properties for the register DTO that are comming in from register.component.ts (angular/frontend)
    public string Gender { get; set; }

    [Required]
    public string KnownAs { get; set; }

    //This needs to be required and optional ? so we can have null values to check. Otherwise this will be populated with today's date 
    [Required]
    public DateOnly? DateOfBirth { get; set; }

    [Required]
    public string City { get; set; }

    [Required]
    public string Country { get; set; }



    /* STUDY NOTES - User DTO that handles client communication without exposing the DATA classes 
    - Uses DataModel convention attributes
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
        
        This class gets its data through the register.component.ts from the front end(angular)
    */
}
