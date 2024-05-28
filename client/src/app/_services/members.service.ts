import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  //Initialing variable for server communication 
  baseUrl : string = environment.apiUrl;

  //Loading data into members array, so we can keep its data throughout the live of the execution
  members: Member[] = [];

  //Injecting http service
  constructor(private http: HttpClient) { }


  //Get all Members, need to pass thw JWT bearer token as options to authenthicate, as requested by the server.  
  //https://localhost:5001/api/users
  getMembers(){
    /* the 'options' in the request are handled by jwt.interceptor.ts now
    return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions());
    */

    // CACHING (GOTO - Notes Below) - Check if the members array is not empty (has data) to return it as an observable 
    if(this.members.length > 0){
      //Of makes it so any value in the method is an observable
      return of(this.members);
    }
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe( //options are handled by the interceptor
      //Using RxJS to map the data from the member that we are getting to the members[] property above
      map((members) => {
        this.members = members; 
        //When you use RxJS you must always return the data that you are intercepting 
        return members; 
      }
    )); 
  }

  //get a single member, same JWT 
  getMember(username: string){
    /* the 'options' in the request are handled by jwt.interceptor.ts now
    return this.http.get<Member>(this.baseUrl + 'user/' + username, this.getHttpOptions());
    */
    //If we get a member, it should be one from the list of members, therefore if the username matches, return the same member, else go to the DB
    const member = this.members.find(member => member.userName === username);
    if(member){
      return of(member);
    }

   return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  //#region Options to get JWT Authorization Token - Replaced by _interceptors > jwt.interceptor.ts

  //Temporary method to get the JWT token for the authenthication to the server

  // getHttpOptions(){
  //   //get the current user stored in the client's browser local storage
  //   const userString = localStorage.getItem('user');
  //   //If we do not have the user, then return 
  //   if(!userString){
  //     /*
  //       This check is necessary for typescrypt (TS) benefit, as the check is not really necessary 
  //       for us because all our users must be authenthicated to get up to this point 
  //         - Authenthication is done on: app.component.ts => setCurrentUser()
  //      */
  //     return;
  //   }
  //   //convert into JS object
  //   const user = JSON.parse(userString);

  //   return{
  //     /*
  //       Return the JWT token bearer information 
  //       - STUDY NOTES: Retrieving JWT in the client site 
  //         1. It must have the space at the end on 'Bearer '
  //         2. The "options" in the get method in the getMembers() take the headers as an option type 
  //         3. Authorization must be spelled as is, be careful as TS won't help with this syntax. 
  //      */
  //     headers: new HttpHeaders({
  //       //Check on (Client's browser F12 > Network > users > headers tag > Authorization)
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }

  //#endregion

  //Update the member in the API, pass the member in the body of the request 
  //CACHING - GOTO notes below 
  updateMember(member: Member){
    return this.http.put<Member>(this.baseUrl + 'users', member).pipe(
      map(() => {
        //EDGE CASE
        /* Not really necessary, but here we are handeling if the use is updating their profile, if they want to go back to it
        to make additional changes, this can avoid making the call to the DB, because it will update the members[] property along 
        with the DB request from the server */
        //use the current member to get the location of it in our members[] property array above. 
        const index = this.members.indexOf(member);
        //With the index, update the current member in the property with the one with the new changes, merging ALL objects in the array with the updated ones and the one currently in the members property.  
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  //Set the main photo based on the photo id
  setMainPhoto(photoId : number){
    //Because it is a put request, we are setting an empty object '{}' inside the request 
    return this.http.put<Member>(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }
  //Delete the current photo
  deletePhoto(photoId: number){
    //We do not really need to set a member, as we are not returning an object of type member, we are just updating an object in the DB, this is also the case for the above, update member and setMainPhoto, as we do not requiere to return an object to display back to the client
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}



/*
STUDY NOTES - DATA CACHING 
  1. Use to avoid multiple calls to the DB 
  2. Best to implement it in a service because the service, unlike a component remains alive for the entire duration until you exit the applications
  whereas the component will get destroy everytime you exit/enter a new component. 

  3. We need to load things into an array which can then be display to the components, without having to make unnecessary calls to the DB (Data Caching)
  4. BUT, this arrays needs to be handled as observables, as that is the expectation when something comes from the DB 
  5. TO make sure is of type "observable" we use the method/keyword "of()", to make sure the data element is interpreted as an "observable"

  6. For the caching we need to use RxJS to intercept the data that we are getting from the database AND 
  to map it (make to be equals to) the property you are using. 
  7. For RxJs you must always return the data that you are intercepting outside the pipe as an observable and inside the pipe as the type of data you are updating. 
    - EXAMPLE: 
      - get members returns an observable of type member,
      - BUT inside the pipe, we are updating the array of members we are getting, which we shall also return. 



  updateMember(member: Member){}
    1. After the request, it updates the local members array to reflect these changes without needing another call to the database to refresh the data displayed to the user. 
    2.  This local update is particularly useful for improving the user experience by providing immediate feedback and reducing network traffic.
      We will avoid having to call the 'getMember()' again, as we will be ahving the latest in our array as soon as the user updates its information.
    3. STUDY NOTES - USAGE OF THE JS SPREAD OPERATOR 
      1. The spread operator (...) is used here for a specific purpose: to merge the updated member information with the existing member information in the members array. 
      2. The spread operator is used to create a new object by combining properties from two objects. In this context, 
      it takes the properties of the current member object (this.members[index]) and the updated member object (member), merging them into a new object. 
      This operation ensures that any changes in the member object are reflected in the corresponding object in the members array.
      3. this.members[index] = {...this.members[index], ...member} creates a new object by taking all properties from the current member object in the array 
      and overriding them with properties from the updated member object. If there are new properties in the member object, they will be added to the object in the members array.

    WHY USE THE SPREAD OPERATOR? 
      1. Immutability: It creates a new object without modifying the original objects. 
      2. Simplicity and Readability: It offers a concise and readable way to merge objects or arrays. 
      Instead of manually assigning each property, the spread operator allows for easily combining objects.
    

*/