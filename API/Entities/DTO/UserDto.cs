namespace API.DTO;
/// <summary>
/// DTO model for returning the JWT token back to the user 
/// </summary>
public class UserDto
{
    public string Username { get; set; }
    public string Token { get; set; }
}
