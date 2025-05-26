namespace API.DTO;
/// <summary>
/// DTO model for returning the JWT token and other needed client information back to the client 
/// </summary>
public class UserDto
{
    public string Username { get; set; }
    public string Token { get; set; }
    public string PhotoUrl { get; set; }
    public string KnownAs { get; set; }
    public string Gender { get; set; }
}
