namespace API.Errors;
public class ApiException
{
    //All the objects are requiered to 
    public ApiException(int StatusCode, string Message, string Details)
    {
        this.StatusCode = StatusCode;
        this.Message = Message;
        this.Details = Details;
    }

    //Status Code of the Request
    public int StatusCode { get; set; }
    //Custom Messages
    public string Message { get; set; }
    //Stack Trace
    public string Details { get; set; } 


    

    /* STUDY NOTES
        1. This class is used to store errors 
    */
}
