using System.Text.Json;
using API.Helpers;

namespace API.Extensions;
public static class HttpExtensions
{   
    public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header){
        //Force camel case in the response 
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        //Pass our Pagination Header into the response - Make sure how the hader (Pagination) is written because we are going to use this header in the client site and must be the same 
        response.Headers.Add("Pagination", JsonSerializer.Serialize(header, jsonOptions));
        //Bypass our custom headers in the current CORS policy that we have active. Otherwise we won't be able to communicate our header to the client. 
        //Careful with misspelled of this access control. This is what the client is expecting as is. 
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }

}


/*
    STUDY NOTES - PAGINATION (3)
    1. We are using HttpExtensions (AddPaginationHeader) to return the PaginationHeader.cs to the client 
    2. This extends the HttpResponse to make it easier to implement 
    3. We are creating new jsonOptions object because this method is outside the controller, therefore it will return things in C# convention (Pascal Case).
    This will make it so things are returned in the expected client format (camel case) 
    4. 
*/