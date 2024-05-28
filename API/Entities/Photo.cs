using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;
//Changing entity framework convention to set a pluralized name for "Photo" table
[Table("Photos")]
public class Photo
{
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; }
    //Property used by cloudinary to indicate the media stored in their services
    public string PublicId { get; set; }

    //Need to add user object to set the relationship with the user, otherwise the convention will not be correct. 
        //Further example on the AppUser.cs Model. (LINK to relationships attached)
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; }

}
