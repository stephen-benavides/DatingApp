import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/paginations';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  //Initialing variable for server communication 
  baseUrl : string = environment.apiUrl;

  //Loading data into members array, so we can keep its data throughout the live of the execution
  members: Member[] = [];
  //Map that contains the members for caching pagination 
  membersCached = new Map();

  //Store the pagination result (STUDY NOTES - PAGINATION)
  /* Final Replaced: Replaced by invoking the method inside the getPaginatedResult<T> for reusability
  paginationResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]> // Replaced by Signal() but same functionality 
  //paginatedResult = signal<PaginatedResult<Member[]> | null>(null) //initialized as null
  */
  
  //Adding the 2 properties that are needed for the AccountService injection to get access to the user. 
  userParams: UserParams | undefined;
  user: User | undefined;
  
  //Injecting http service
  //private http = inject(HttpClient); // You can inject dependencies through either constructor or this inject() method
  constructor(private http: HttpClient, private accountService: AccountService) { 
    //You can inject services to other services as long as you dont create a circular reference by injecting the memberService into the AccountService. It won't work.
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      //When subscribing we get the user, if it exists, then initialize the UserParams class with the user. ANd, get the user object as well
      next: (user) => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
  }

  //Helper methods to get and set the user parameters, which can be used on the component to get the params information throughout all components that use this service.
    // We are storing everything in the service layer to avoid multiple calls to the API.
  gerUserParams() {
    return this.userParams;
  }
  setUserParams(params: UserParams) {
    this.userParams = params;
  }
  resetUserParams() {
    //check if we have the user to create a new instance with the default user params 
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }
  


  //#region Original getMembers() method without pagination  
  ////Get all Members, need to pass thw JWT bearer token as options to authenthicate, as requested by the server.  
  ////https://localhost:5001/api/users
  //getMembers(){
  //  /* the 'options' in the request are handled by jwt.interceptor.ts now
  //  return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions());
  //  */
//
  //  // CACHING (GOTO - Notes Below) - Check if the members array is not empty (has data) to return it as an observable 
  //  if(this.members.length > 0){
  //    //Of makes it so any value in the method is an observable
  //    return of(this.members);
  //  }
  //  return this.http.get<Member[]>(this.baseUrl + 'users').pipe( //options are handled by the interceptor
  //    //Using RxJS to map the data from the member that we are getting to the members[] property above
  //    map((members) => {
  //      this.members = members; 
  //      //When you use RxJS you must always return the data that you are intercepting 
  //      return members; 
  //    }
  //    )); 
  //}
  //#endregion


  //getMember with pagination implemented (STUDY NOTES - PAGINATION (7) )
  getMembers(userParams: UserParams) {
    //console.log(Object.values(userParams).join('-'));
    //Check if we have captured the cached response
    const cachedResponse = this.membersCached.get(Object.values(userParams).join('-'))
    if (cachedResponse)
      return of(cachedResponse);

    //Convert all parameters into a Http Params object 
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    //Adding additional filters to the HttpParams string
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResults<Member[]>(this.baseUrl + 'users', params).pipe(
      map(response => {
        //Using the pipe to use the map RxJS function - to store the response for the specified parameters into the membersCached Map collection
        this.membersCached.set(Object.values(userParams).join('-'), response)
        return response;
      })
    )
  }
  ///Generic method to return paginated results based on user parameters
  private getPaginatedResults<T>(url: string, params: HttpParams) {
    const paginationResult: PaginatedResult<T> = new PaginatedResult<T>;

    //Notes - PAGINATION (7)
    //Previously <T> was Member[]. Updated to make it reusable
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      //Using the map to put the elements comming from the response into an object in this page
      map(response => {
        //If we have a body in the response - load it into the paginationResult object 
        if (response.body) {
          paginationResult.result = response.body;
        }
        //Get the response header from the server - the name in the server must be the same (API.Extensions > HttpExtensions> AddPaginationHeader())
        const pagination = response.headers.get('Pagination');

        if (pagination) {
          //We must serialize the object into JSON format so we can use it in the front end 
          paginationResult.pagination = JSON.parse(pagination);
        }
        //In a map you must always return the object you are mapping 
        return paginationResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    //Angular class that allow us to obtain the parameters from the query string 
    //Utility class from angular - which allow us to set query string parameters along with our http requests 
    let params = new HttpParams();
    //if we have the page and itemsPerPage comming in from the client, then pass that data in the query string
    if (pageNumber && pageSize) {
      //This must have the same name as what is expected by the server 
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }

  getMember(username: string) {
    //Using the cached member array to avoid makaing the call back to the API
    /*
      * Using the spread operator (notes below) to create a new array that grows every time the user paginates to a new page to stores the results.
          Returns an array named result inside an array which is the main body
      * Using reduce() - a CallBack function (functions that can be either anonymous {} or not), in this case the initial value is an empty array where we are going to be putting all values from the previous result array to reduce the number of nested arrays
          Returns an array without the 'result' just a simple array with all the values added as is
      * Using find() to get the specific member from the list of cached members to avoid making the call to the DB if this member is found.
    */
    const member = [...this.membersCached.values()]
      .reduce((previousVal, currentVal) => previousVal.concat(currentVal.result), [])
      .find((member: Member) => member.userName === username);
    //console.log(member);
    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  
  //#region Replaced By using the membersCached Array instead of the simple member[] we had before. 
  /* 
  //get a single member, same JWT 
  getMember(username: string){
    // the 'options' in the request are handled by jwt.interceptor.ts now
        //return this.http.get<Member>(this.baseUrl + 'user/' + username, this.getHttpOptions());
    
    //If we get a member, it should be one from the list of members, therefore if the username matches, return the same member, else go to the DB
    const member = this.members.find(member => member.userName === username);
    if(member){
      return of(member);
    }

   return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }
  */
  //#endregion


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
    
    
    
    
    STUDY NOTES - PAGINATION (7) - Client Side 
      1. We are creating modifying the get members method to obtain a paginated method which is going to be more efficient. 
      2. We are updating the method signature of the getMembers() in order to pass the parameters that are expected for the pagination 
        1. Parameters from the server side can be found in API.Helpers > UserParams.cs
          getMembers(page?: number, itemsPerPage?: number)
          1. They are both optional because we already have default values in the server

      3. As we need to get the params for the response, we must do changes to the GET method 
        1. return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
          1. the get by default gets the data from the body of the response and thats what is being returned - 
            as we now we also need the entire response, we want to 'observe' the response. 
            1. return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe( 
            2. By also observing the response, we make sure to get the current params that were stated in the new method as well
            3. This will allow us to get EVERYTHING from the response such as the Access-Control-Expose-Headers and the Pagination header - 
              which is the same as what is returned in postman when invoking the method - in the headers of the response



*/