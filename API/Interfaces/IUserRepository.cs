using API.DTO;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;
public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAllAsync();
    //Get a list of all the users
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser> GetUserByIdAsync(int id);
    Task<AppUser> GetUserByUsernameAsync(string username);

    /*AutoMapper Implementations to improve queries*/
    //Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
    //This one is used to Get the USER by the username which is stored in the cliams principal and acceseed in the controller
    Task<MemberDto> GetMemberByUsernameAsync(string username);
    
}
