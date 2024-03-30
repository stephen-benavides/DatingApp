import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
///Service for handleing user login throughout the application 
export class AccountService {
  //Base URL - string that has the location of our services in the server 
  baseUrl: string = environment.apiUrl;// GOTO for notes (src/environments/environment.ts) //'https://localhost:5001/api/';

  /*
    Creating BehaviorSubject to export the user to other components (bellow) 
    var currentUserSource = new BehaviorSubect(); 
    | indicates it can be either User or Null 
      1. You can use 'any' but is not advised as it goes against type script it defeats its purpose 
  */
  private currentUserSource = new BehaviorSubject<User | null>(null);
  /*
    store the behaviorSubject to observ data, we can then use this property to access this observable outside this service without exposing the logic 
    $ is standard to indicate that a property is observable 
    - We are using this property to actually interact with this account service
  */
  public currentUser$ = this.currentUserSource.asObservable(); 


  /*
      - When initializing the ctor, inject the Http client to handle requests. 
      - It works similar to XMLHttpRequest(Tuition Reimbursement proj. JAVA) 
      to open the HTTP request to the client and send the body of the request
      - The HttpClient is injected when the service is initialized, by the system.
      - private HttpClient http 
  */
  constructor(private http: HttpClient) { }

  /*
      - TEST1
      - Login to the 'account/login' endpoint and passes the model 
      which contains the username & password in the body of the request
      - 'any' type is used to avoid type safety. Use only during initial testing. 
  */
  /*login(model: any){
    //This returns an observable of the response. Any observables must be subscribed to in order to use them 
    return this.http.post(this.baseUrl + 'account/login', model)
    }
  */


  /*
      - TEST2
      - Creating new Login Method that implements pipe and wihout type. 
      - Also uses RxJS to set up a pipe to store the username in the local storage before it is even subscribed to
  */
  /*
  login(model: any){
    return this.http.post(this.baseUrl + 'account/login' , model).pipe(
      map((response: any) => { //map takes arrow function "()=>{}" (function with an argumant, which indicates the response)
        const user = response; //Set the user equal to the current mapped response 
        //Check if the the response exists (user)
        if(user){
          localStorage.setItem('user', JSON.stringify(user)) //In the local storage, set a key/value pair. stringify because it comes as an object from the server, and local storage only accepts string 
          window.alert("Logged In: Value added to F12 > Storage > Local Storage");
        }
      })
    )
  }
  */

  /*
    Creating Login Method That Implements the Pipe(RxJS) To retrieve the data before its subscribed to set behavior using map 
    Using Type Safety
   */
  login(model: any){
      return this.http.post<User>(this.baseUrl + 'account/login', model).pipe( //2) The post or get that we are trying to retrieve from the server must be explicetely stated to be the type of object you are expecting (Generic <>)
        map((response: User)=>{ //1) change the response to retrieve a User(model) instead of any 
          const user = response;
          if(user){
            localStorage.setItem('user', JSON.stringify(user))
            // window.alert("username: " + user.username + " token: " + user.token);
            /* Storing the value of the user in the BehaviorSubject object 
                As any observable, you need to define what to do next, on error and on complete 
            */
            this.currentUserSource.next(user);
          }
          return user;
        })
      )
  }

  /*
    - Use this method to initialize the service from the root component (app.component.ts) if the user is currently active(is logged in)
    - This avoids the issue of getting logged out when initializing the page 
      As the service that we use the observe the user is initialized 
    - public void setCurrent()
  */
 setCurrentUser(user: User){
  this.currentUserSource.next(user);
 }


  logout(){
    //When user logs out, then remove from the local storage browser the item 'user'
    localStorage.removeItem('user');
    // window.alert("Logged Out: Value remove from F12 > Storage > Local Storage");
    /* Storing the value of the user in the BehaviorSubject object- set to null */
    this.currentUserSource.next(null);
  }


  //register the user in to the DB 
  register(model:any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      /*
        When you use map to project, you also need to return the map as well 
       */
      map((user) => {
          if(user){
            //If there is a response then add the user to the storage (assume logged in)
            localStorage.setItem('user', JSON.stringify(user));
            // Add it to the behaviorsubject variable so we can use outside the service, it is an observable so we need to add as next, complete, etc
            this.currentUserSource.next(user);
          }
          //#region  Using Return User inside the map (RxJS) 
          //Needs to be returned if something is projected by the map (RxJS) 
          /* If you are logging this method on a component/ you need to use the data modified, you need this to do it, else you wont retrieve data 
              ON: register.component.ts => subscribe => next:(response) =>{
                    console.log(response);}
              console.log() - Previously: undefined 
              console.log() - Now: Object { username: "harry", token: "..JQWtt-.." }

              On this component we do not need this information that is returned, so commenting out
           */
          //#endregion
          //return user; //Commenting out, explanation inside region above 
      })
    );
  }
  
}



/**
      To use this service you must inject it to the component you want to implement it to. 
      nav.component.ts
*/



//#region Study Notes - Implementation of NG SERVICES - to be used throughout the live of the NG application
/* 
    Services Notes 
    1. Services are global and affect the entire application 
    2. Always best to create a new folder for the services for the same reason 
    3. _service was created because '_' puts the folder at the very top. But, it depends on the organization 

    Creating a service 
      1. ng generate service [name] --dry-run
      2. ng g s _service/account --dry-run

    The 'Injectable => providedIn: 'root'' 
      1. Means the service is injected in the root by default ()
        1. app.module.ts => @NgModule => Providers[]
        2. You can overwrite the convention by seeting a new 'providedIn' based on the requierements 


    Services TTL (Time To Live)
      1. Services are only destroyed when the user exists the site, in this case as its in the root. The service will be running at the same time the application starts. 
      And it will be destroyed when the user closes the browser

    Services are Injectable 
      1. We can inject them in any component 

    Services are Singletons 
      1. Are instantiated when the application starts, and destroyed when the application is exited 
      2. This is the main difference from components, as the component is destroyed as soon as you leave the page implementing them 
      
    SUMMARY: 
      Services are always alive for the duration of the entire application, which makes them perfect for storing state. 
      But, the service does gets refreshed when the user exists the application, this means when the user hits the refresh button, the service is exited 

    STUDY NOTES: Persisting a Service
      1. Avoiding a service getting terminated when the user exits or refreshes the page 
      2. As long as the application is alive the service is alive, but we can store the state of a service in the browser storage 
      3. Every browser has an storage but its important to only store requiered information, as it can become cumbersome for the user 
      4. Access Web Browser Storage 
        1. Go to browser 
        2. F12 (dev tools)
        3. Application (tab)
        4. Scroll down to storage area 
          1. In this storage area you can find the cookies, trusted tokkens, local storage, and so on 
        5. Go to local storage 
        6. Store the user dto inside the local storage in the Client Site to persist the login functionality even if the user closes the page completely 




    STUDY NOTES: HttpClient 
      1. Class that is injected from the root model
      2. You need to declare it in the costructor, which will get initialized as soon as the application starts, as that is how services behave (providedIn: "root")
      3. Allows for POST PUT DELETE (RestAPI operations)
      4. Behaves like XmlHttpRequest (Jquery/JS)
      5. In Postman you send the information in the body of the request if in the server has been configured in such a way. Here is the same, as one of the parameters in the httpclient is 'body'
        return this.http.post(this.baseUrl + 'account/login', model)
        1. Parameters
          1. Where URL is the URL of the request in the server ('http:xxx:5001/api' + account/login)
          2. Where model is the object that communicates from the client i.e username and password 
          3. You can also pass options and headers based on the requierements 

      6. This returns an observable 
      7. Any component that wants to implement the observable must subscribe to it and relay what to do (next: error: complete)
        i.e. nav.component.ts => login(model: any);



        
    STUDY NOTES: Observables 
      1. They are lazy
      2. Able to cancel 
      3. Only subscriber of the newsletter receive the newsletter 
      4. If no-one subscribe, it wont get printed (used)
      5. Can use wwith map, filter, reduce and other operators 
      6. The previous versions of JS use Promises instead of Observables 
      7. Can use RxJS to transform the data that is observed 
        1. Using .pipe  (and .map) 
          1. Data that is projected using map in the pipeline, needs to be returned inside the map, 
          else you wont get the data that is transformed by the map in the response 
          i.e. register() in this service 
        2. Do something with the observable as it comes down from the API 
        3. Add more functionality such as mapping the data as soon as we get it before someone subscribes to the service
      8. When Subscribing, the method that subscribes to an observable must implement what to do:
        1. next => when 20X code is retreieve, what to do 
        2. error => anything outside of 200(ok) is captured by error, how to hanlde in such cases
        3. complete => when the function finishes, regardless of error. what to do
        4. Example of this is the subscription made to the login method by the nav bar (nav.components.ts) 
      9. You can send an obsevable to a promise using (toPromise()) to convert the initial observable and use the properties of promises 
        1. Not used in this application
      10. You can also get the data from observables by using an Async Pipe
        1. Angular built in function 
        2. Uses the pipe '|' (Union Type)
          i.e <li *ngFor='let member of service.getMember()' | async'>{{member.username}} </>
          1. Automatically subscribes/unsubscribes from the observable 
          2. The pipe automatically unsubscribe without having us to do so manually 
      11. For HTTP requests you normally do not need to unsubscribe from observables, as an HTTP request gets automatically completed and returns a server code 
        
    STUDY NOTES: Promises
      1. Similar functionality as Observables, wwith the following differences: 
        1. In a promise, wait for it to comeback 
        2. Cant be canceled 
        3. Not lazy, as soon as executed the method, you execute the method regardless if someone uses them or not 
        4. Uses 'Then' instead of 'Next' keyword 

*/
//#endregion


//#region STUDY NOTES: TypeScript in the Request
/*
  Previously we have been using any to handle the request, and getting a non-generic response 
  To implement Type Safety 
    1. When getting the request of the object in post, you must add the type of object you are expecting the response to be 
      return this.http.post<User>(this.baseUrl + 'account/login', model)
    2. In this case is <User> 
    3. This user has been created by creating an interface in angular source folder (_models)
      1. Unlike C# in ANgular it is not expected to have I before the name of the object 
      2. The properties inside do not use non-generic values (var, let, const)
      3. You must define the type properly (string, int, char, double, etc) 
    4. The map, which is used to modify the object pior to subscription inside a pipe, the response must have the type of object defined as well 
      1. map((response: User)=>{}

*/
//#endregion


//#region STUDY NOTES: Utilization of Observables outside of the Services using "Behavior Subject"
/*
  Lets other components use this account.service to accertain that the user has logged in
  1. Using BehaviorSubject to set a variable as observable which we can export outside the service 
  2. Any other component such as the root component can use this service when attached to a Behavior Subject 
  3. Behavior Subject is a special type of observable with an initial value that we can use outside. 
  4. A Behavior Subject requires an initial value. Thus, the standard is to initialize it with null 
    1. In Angular you can have an object to be more than 1 type by seprating the type using the pipe '|'
      i.e. private currentUserSource = new BehaviorSubject<User | null>(null);
        1. This indicates that this behaviorSubject can be either the type User or null, and its initialize with null. 

*/
//#endregion