using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API;

[ApiController]
[Route("/api/[controller]")] //api/users
public class UsersController : ControllerBase
{
    private readonly DataContext _context;


    public UsersController(DataContext context)
    {
        _context = context;
    }

    /*
        Async code
        1. set the method signature with async and Task<>
        2. the code needs to implement async method - look for the usaual method you want to implement followed by Async (ToListAsync())
        2. async method that are implemented requiere tue await keyword 
    */
    [HttpGet] // /api/users
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return users;
    }


    [HttpGet("{id}")] // /api/users/2
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        return await _context.Users.FindAsync(id);
    }
}
