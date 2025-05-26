using Microsoft.EntityFrameworkCore;

namespace API.Helpers;
public class PagedList<T> : List<T>
{
    public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    {
        CurrentPage = pageNumber;
        //If in out calculation we have more than 1 page (1.2), then this will return 2 pages to take into consideration the highest reminder. The ceiling of 1. something is 2
        TotalPages = (int) Math.Ceiling(count/(double)pageSize);
        PageSize = pageSize;
        TotalCount = count;
        //Method that can be invoked on a list.
        //It allows us to add items to the end of the current list => PagedList<T> 
        //When creating new instances of this class, we will be able to add/insert the previous and new results from PagedList<T> 
        //Using this on CreateAsync() method on this class
        AddRange(items);
    }

    public int CurrentPage { get; set; }    
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize){
        //Count of items from our query - this will execute against our db, and return the objects in the source (query)
            //Count the items availble in our query (source)
        var count = await source.CountAsync();
        //Skip and Take explained below - get our items from the DB using skip and take operator (deferred execution)
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        //Return a new list with all the items from the DB - we can do this because we are using AddRange() in the constructor to add the current items into this class
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}

/*
    STUDY NOTES - PAGINATION (1)
    1. We need to specify the objects that we want to paginate. 
    2. To do so, we are using this class as a generic method (that will replace MemberDto) to return the paginated members as a list 
    3. The method CreateAsync is to prepare the query before it is executed in the DB. 
        1. The execution will happen a soon as 'CountAsync' happens 
    3. Skip and Take 
        1. These methods are used for the deferred execution 
        2. Skip here is used to make sure that if we are in the 1st page, nothing is going to be skipped 
        3. Take the page size as in return the page the total number of records.
        4. The toList() is to execute this method (Entity Framework)

*/