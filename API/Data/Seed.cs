using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
public class Seed
{
    /// <summary>
    /// Custom method to read the data from Data/UserSeedData.json and load the users 
    /// and their information into the database for testing purposes.
    /// 
    /// To run this code, do it as soon as the application starts up, in the entry point of the application (Program.cs)
    /// Adding the code after all middleware has run, 
    /// after app.MapController(); and before app.Run();
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public static async Task SeedUsers(DataContext context){
        //If there is data already in the users table, then do nothing, nothing to add. 
        //Else the users table is empty, so load the testing data in the user data table 
        if(await context.Users.AnyAsync())
            return;

        //Read the data in the json testing file
        var userData = await File.ReadAllTextAsync("Data/UserSeedData,json");
        //Set options, in case the JSON is not cased properly, so it will be easier to parse
        var options = new JsonSerializerOptions{
            PropertyNameCaseInsensitive = true
        };
        //Convert from JSON object to C# object(Model/Entity: AppUser) 
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

        //add each user to the users table 
        //Use the same logic as the registration(Controllers/AccountController)
        foreach(var user in users){
            using var hmac = new HMACSHA512();
            //Setting registration parameters for each user 
            user.UserName = user.UserName.ToLower();
            //Using the same "secure" password for all the "seed" users
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswordSalt = hmac.Key;

            //Add the user with the hashed and salted password in the users table 
            context.Users.Add(user);
        }

        //After adding all the user, save the changes, otherwise they wont affect the DB
        await context.SaveChangesAsync();
    }
}


/*STUDY NOTES - Custom Code for loading seed data from JSON file 
    - And running the code at run time by injecting the service in Program.cs 
    - More information on OneNote > MoreProgramming > SQL > Seeding Any Database
*/
