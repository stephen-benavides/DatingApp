using API.Extensions;

namespace API.Entities;
public class AppUser
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string KnownAs { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public string Gender { get; set; }
    public string Introduction { get; set; }
    public string LookingFor { get; set; } 
    public string Interests { get; set; }
    public string City { get; set; }    
    public string Country { get; set; }

    //Instantiating the list as soon as the entity is created
        //Short hand function new List<Photo>(); => new();
        //THIS is a a navigation property, as it is used to navigate to photos from the user 
    public List<Photo> Photos { get; set; } = new List<Photo>();


    /* GOTO - Notes Below for Explanation as to why this is commented out
    /// <summary>
    /// Calculate the age based on the dob, based on the naming convention, 
    /// the age will be resolved for the DTO class MemberDTO
    /// For more information GOTO MemberDto.cs => int age property
    /// </summary>
    /// <returns></returns>
    public int GetAge(){
        //Custom Extension Method 
        return DateOfBirth.CalculateAge();
    }
    */
}

/*
        STUDY NOTES: User Table, implementing Entity Framework Conventions, AutoMapper
            1. Entity Framework
                1. Data Relationships:
                    1. By creating a list with another table inside your class, entity framework will recognize 
                    the change and create the necessary dependencies, so you can access "Photos" inside the 
                    Users table 
                    i.e. public List<Photo> Photos { get; set; } = new List<Photo>();
                2. Check conventions to make sure the relationships that we are trying to set are correct 
                    https://learn.microsoft.com/en-us/ef/core/modeling/relationships/one-to-many

            2. public int GetAge() has been commented out because: 
                1. It is making so the automapper is invoking all the data to meet the conditions for this method 
                2. Its implementation is being made in the automapper class helper 
                    1. Helpers > AutoMapperProfiles.cs
    */

