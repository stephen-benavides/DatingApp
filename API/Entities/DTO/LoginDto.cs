using System.ComponentModel.DataAnnotations;

namespace API.Entities.DTO;
public class LoginDto
{
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
}
