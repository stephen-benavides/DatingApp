using API.DTO;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper)
    {
        this._context = context;
        this._mapper = mapper;
    }

    public async Task<MemberDto> GetMemberByUsernameAsync(string username)
    {
        //GOTO - Notes below to check how reflection is implemented manually (without automapper)

        //Using AutoMapper to Project into MemberDto from AppUser, no need to use .Include() [eager loading] for the related class (photosDTO), it is done by automapper by default
        return await _context.Users
        .Where(appUser => appUser.UserName == username)
        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        .SingleOrDefaultAsync();
    }

    /* Replacing this method to now be able to paginate - Notes Below - PAGINATION (5)
    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        //GOTO - Notes below to check how reflection is implemented manually (without automapper)
        return await _context.Users
        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        .ToListAsync();
        
    }
    */
    /// <summary>
    /// Get a list of all the members associated to a user - paginated 
    /// </summary>
    /// <param name="userParams">user params that contain pagination information to be returned to the client</param>
    /// <returns></returns>
    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        //var query = _context.Users
        //.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        //.AsNoTracking(); //This is not required, we are just letting entity framework now that they should not track this query (best practices)

        //Needs to be AsQueryable, otherwise we wont be able to use the where parameters
        var query = _context.Users.AsQueryable();
        query = query.Where(u => u.UserName != userParams.CurrentUserName); //Return all users BUT excluding the current user, as it is not required in the list
        query = query.Where(u => u.Gender == userParams.Gender); //From the above list remove all members from the same sex
        query = userParams.OrderBy switch //switch case to set the order by created or lastActive based on input
        {
            "created" => query.OrderByDescending(u => u.Created),
            _ => query.OrderByDescending(u => u.LastActive)
        };

        //Substract the max age requierement from today's date; -1 to include birthdays
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

        //Notes below - PAGINATION (5)
        return await PagedList<MemberDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
            userParams.PageNumber,
            userParams.PageSize);
    }

    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        //primary key usage, FindAsync is the fastest 
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        //There should only be 1 user that exists, you can also use FirstOrDefault()
        return await _context.Users
        .Include(appUser => appUser.Photos) //eagerly loading = loads all the elements insitead of waiting
        .SingleOrDefaultAsync(appUser => appUser.UserName == username);
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        //Using eagerly Loading to include the photos into the elements we also want to load for the user. 
        return await _context.Users
        .Include(appUser => appUser.Photos)
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        //GOTO: Notes Bellow 
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user)
    {
        //GOTO: Notes Bellow 
        _context.Entry(user).State = EntityState.Modified;
    }
}

/* STUDY NOTES Implementing Repository Pattern on AppUsers 

    - For Async, although the interface does not have the async keyword for the task, you must include it in the implementation, 
    else there might be unexpected errors or behaviors 

    - SaveAllAsync()
        - SaveChanges() is a method that returns the NUMBER of changes made to the DB
            - As for this implementation we want a boolean, we only need to return if at least 1 change was made to the DB. 

    - Update()
        - Entry() is use to track information or change the information for the entity.
            - In this case we want to inform the entity framework tracker that an update has been made
            - We are NOT SAVING anything in this method (Update())
            - NOTE: We do not really this need this implementation, because every time we make a change in the data in the Entity Framework. 
                Entity Framework already tracks these changes automatically (any changes)
                This is included just in case is necessary later on 

    - IMPLEMENTATION 
        - Add this implementation as scoped inside your services 
        - As this is scoped to the HTTP requests 
        - Location of implementation => ApplicationServiceExtensions.cs 



    STUDY NOTES - Implementing AutoMapper for Projection (Queryable Extensions) in UserRepository
        - Also known as Queryable Extensions, it replaces the Select() extension method from LINQ
        - Projection is used to replace manually mapping the data from the dbContext to the DTO:
        - This will help create queries with less overhead, as only the requiered data will be selected
            - THIS ONLY HELPS BY A BIT, TO ACTUALLY IMPROVE EFFICIENCY, USE CACHING, TO AVOID MULTIPLE CALLS TO THE DB.

        - By using .Project() from IMapper, we do not need to eagerly load (Not need to use the .Include() LINQ extension method) the related entities, as it is done by AutoMapper automatically
        - EXAMPLE USING MANUAL MAPPING: 
            public async Task<IEnumerable<MemberDto>> GetMembersAsync()
            {
                return await _context.Users
                .Select(appUser => new MemberDto{
                    UserName = appUser.UserName,
                    City = appUser.City,
                    Id = appUser.Id,
                    //And so on... //This is how it is done without automapper, reflecting each property inddividually by using the Select() method 
                })
                .ToListAsync();
            } 
            1. In this case we are using Select to reflect from AppUser to MemberDto
            2. This is doable, but very time consumming 
            3. Thus, automapper is preferable for enerprise. 
        
        - EXAMPLE USING AUTOMAPPER 
            public async Task<MemberDto> GetMemberByUsernameAsync(string username)
            {
                return await _context.Users
                .Where(appUser => appUser.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
            }

            1. .ProjectTo<MemberDto>(_mapper.ConfigurationProvider) replaces the Select() 
                1. <What is going to be projected> (the configurations)
                2. the configuration is comming from the Program.cs, we set the property when we initialize the automapper (Extensions > ApplicationServicesExtensions)
                3. Automapper does all the configurations for all 
                4. Do not forget to implement the IMapper interface to get the ConfigurationProvider 



    STUDY NOTES - PAGINATION (5)
    1. Implementing the Pagination in our respository in GetMembersAsync(UserParams userParams)
    2. In the controller we are letting know that the client will be pasing the parameters from the query string in the URL.
        1. Therefore we need to update the signature in the implementation by using the [FromQuery] in the method
        2. We need to be explicit, otherwise it won't work 
        3. Here it does not matter because this communicates using data comming in from the controller, so it must be done at the controller level only
    3. return await PagedList<MemberDto>.CreateAsync
        1. We are able to load this as follows because: 
            1. CreateAsync is an static method. Thus, we do not need to initialized 
            2. The CreateAsync itslef already returns a PagedList, which is being expected by the controller. 
        2. From the user we are able to populate this class, and we are able to track the changes because of the AddRange method inside the ctor of PagedList (Pagination (1) notes)
*/