namespace API.Helpers;
public class PaginationHeader
{
    public PaginationHeader(int currentPage, int itemsPerPage, int totalItems, int totalPages)
    {
        CurrentPage = currentPage;
        ItemsPerPage = itemsPerPage;
        TotalItems = totalItems;
        TotalPages = totalPages;
    }
    public int CurrentPage { get; set; }
    public int ItemsPerPage { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }

}


/*
    STUDY NOTES - PAGINATION (2)
    1. This class communicates with the client by passing the pagination data as a header, it is developer preference, as you could also do it from the body of the request. 
    2. They client will be able to fish out the pagination detail from this class through the HTTP response 
    3, As we are going to be returning this class into an HTTP response, we will need to create an extension methods that extends
    from the HTTP class to make it asier for us. 
        1, The class that we will use to return this inside the http response we are using the HttpExtensions.cs (Extensions > ) custom extension
        2. The data here gets populated in the UsersController by the data passed in the parameter
*/