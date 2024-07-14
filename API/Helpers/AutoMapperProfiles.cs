using API.DTO;
using API.Entities;
using API.Entities.DTO;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;
public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        //GOTO: Notes Below For Explanation
        CreateMap<AppUser, MemberDto>()
        .ForMember( //Photo URL Mapping 
            memberDtoDestination => memberDtoDestination.PhotoUrl, 
            option => option.MapFrom(source => source.Photos.FirstOrDefault(photo => photo.IsMain).Url))
        .ForMember( //Mapping the age using the GetAge()=> CalculateAge() Extension method for the DOB. originally from the AppUser.cs Model/Entity 
            destination => destination.Age,
            option => option.MapFrom(src => src.DateOfBirth.CalculateAge()));

        CreateMap<Photo, PhotoDto>();

        //Map Between MemberUpdateDto and the user in the DB  
        CreateMap<MemberUpdateDto, AppUser>();

        //Mep between ReigsterDto and the user in the DB
        CreateMap<RegisterDto, AppUser>();
    }
}


/*STUDY NOTES - AUTO MAPPER (Installation && Implementation CLASS)

    - This class belong to the helper category as it is a helping element that will provide us with the method to make our lives as developers easier
    - INSTALLATION: 
        1. Nuget Package Manager 
        2. Search for automapper 
        3. Select latest version of: AutoMapper.Extensions.Microsoft.DependencyInjection by Jimmy Bogard 
        4. Make sure your csprj is selected 
        5. ** Create a new class that will implement the automapper (This class)
        5. Need to create a map from our main class to the DTO (AppUser => MemberDto)
        6. You only need to create the mapping in the constructor of the class 
        7. Make sure this class that is going to be used by the automapper is implementing the "Profile" class 
        8. Need to inject this class into our services (ApplicationServiceExtensions => Program.cs) to use it. 

    - USES: 
        - In this class you can set your own conditions for how the mapper is going to work
        - Such as mapping custom properties that do not exist in your source class (AppUser). during compilation 
            - EXAMPLE: 
                * CreateMap<AppUser, MemberDto>()
                .ForMember(
                    memberDtoDestination => memberDtoDestination.PhotoUrl, 
                    option => option.MapFrom(source => source.Photos.FirstOrDefault(photo => photo.IsMain)));
                - In the previous example we are checking if: 
                    - Map from the destination member (MemberDto), the custom property that does not exist in the source (AppUser) PhotoUrl
                    - As an option to map this element through the automapper, from the source we are cheching IF the first instance IsMain (mapped property from source to destination)
                    - The inside the AppUser > Photo, the element is IsMain, there could only be 1 main, thus FirstOrDefault()

        - Implementing new mapping conditions 
            1. For any new mapping conditions, you need to add extra .ForMember() for each new property 
            2. You can have as many as you need. 
        - IF there are any new objects you want to map, you must do so here FIRST, as it is a requierement for the automapper to work, else it wont know the objects that it needs to map.
            Regardless if you want to set additional conditions or not. 

*/