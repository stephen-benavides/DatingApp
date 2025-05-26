namespace API.Helpers;
public class UserParams
{
    //Initial value of the max page for the user 
    private const int MaxPageSize = 50;
    //Begin with the first page 
    public int PageNumber { get; set; } = 1;
    //Initialize how many records per page 
    private int _pageSize = 10;
    public int PageSize
    {
        get => _pageSize; //return page size
        //If the value is larger than the allowed Max Page Size, then return the max page size. Otherwise return the value set by the client
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }

    public string CurrentUserName { get; set; }
    public string Gender { get; set; }
    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 100;
    public string OrderBy { get; set; } = "lastActive"; //default case if no info is input for the order by - by the client
}
/*
    STUDY NOTES - PAGINATION (4)
    0. Entry point of our application that the user will have access to
        1. The properties in this page are updated from the query string which is send by the client
            1. DatingApp/client/src/app/_models/paginations.ts 
    1. The client will communicate with this class to let us know how many pages they want to be able to see in the application
    2. We are implementing a maximum number of elements to be displayed, otherwise it will defect the purpose of the application 
    
*/