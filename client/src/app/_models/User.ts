//public interface IUser 
/*
    Difference between interfaces in C# and Type Script 
    - export interface User 
        - The I is optional 
 */
export interface User{
    username: string;
    token: string; 
}


/*STUDY NOTES
    INTERFACES 
        1. In Angular interfaces are MODELS objects (c#)
        2. You can create this by setting manually a new file into the created folder 
            1. You can also use ng g c i(interface)
            2. Nothing else should be added or updated in the app.module or anywhere else 
        3. Use to store the objects that are used within the application 
        4. Make sure is of type:
            - export interface <Type>
        5. The interface must be declare as an object type (string, int, long .... etc )

*/