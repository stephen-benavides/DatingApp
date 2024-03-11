namespace API.DTO;
/// <summary>
/// DTO class for displaying requiered data from UserRepository.cs
/// </summary>
public class MemberDto
{
    public int Id { get; set; }
    public string UserName { get; set; }
    
    /*Instead of DOB, we want the date from the client only
        public DateOnly DateOfBirth { get; set; } => Age
    */
    public int Age { get; set; }
    //URL of the photo that the user has set as Main (PhotoDto.cs)
    public string PhotoUrl { get; set; }
    public string KnownAs { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public string Gender { get; set; }
    public string Introduction { get; set; }
    public string LookingFor { get; set; }
    public string Interests { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    /*Passing photoDTO to avoid recursion 
    public List<Photo> Photos { get; set; } = new List<Photo>();
        - The class gets initialized by our main objects so removing initialization of the list for the DTO
    */
    public List<PhotoDto> Photos { get; set; } 
}


/* STUDY NOTES - AUTO MAPPER (DTO CLASS)
    - Using this class to display the data we want from the UserRepository to the client. 
    - Using automapper, as EF creates perpetual invocation of nested objects, so we need to avoid the recursion. 
        - You can check how it gets invoked by checking the relationship between UserRepository.cs and Photo.cs 
    - This class and PhotoDto.cs are used to mitigate the problem 

    - AUTOMAPPER CONVENTIONS
        - As long as the name and type matches, automapper will take care of everything 
        - public int Age { get; set; }
            - AUTOMAPPER is going to check the UserRepository and see the method GetAge()
            - AUTOMAPPER is smart enough to see this convention and call the method to get the necessary age for us
            - IT IS IMPORTANT the keyword (get) in GetAge(), otherwise this will not be done automatically by automapper 
*/
