namespace API.Extensions;
public static class DateTimeExtensions
{
    /// <summary>
    /// Extension method to calculate the current age of the user 
    /// </summary>
    /// <param name="dob"></param>
    /// <returns></returns>
    public static int CalculateAge(this DateOnly dob){
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var age = today.Year - dob.Year;

        //Check if the user already had their birthday, if they did, then substract 1 year from the age 
        if(dob > today.AddYears(-age))
            age--;

        /*
            TODO:
            - Calculate leap years
            - Exact age based on date and time 
        */
        return age;

    }
}

/*
    STUDY NOTES - Custom extension to calculate the right birthday for the user
    
    - Loaded in the User table model
*/