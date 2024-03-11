using API.DTO;
using API.Entities;

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
    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<MemberDto> GetMemberByUsernameAsync(string username);
    
}
