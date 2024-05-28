namespace API.Helpers;
public class CloduinarySettings
{
    public string CloudName { get; set; }
    public string ApiKey { get; set; }
    public string ApiSecret { get; set; }
}


/*
STUDY NOTES - CLOUDINARY (1)
    1. You can find additional notes about the installation of cloduinary on OneNote > ASP.NET Core > Server Outisede Services
    2. This is a helper class to map all the configuration from appsettings.json
    3. This class and the json information on appsettings.json must match, otherwise the mapping won't be sucecssful 
    4. In the program.cs, inject the service to map the configuration 
        1. In this project, we are adding all our external services on: API > Extensions > ApplicationServicesExtensions
        2. services.Configure<CloduinarySettings>(configuration.GetSection("CloudinarySettings")); 
            1. the .configure is used to bind to this class from the config file. 
*/
