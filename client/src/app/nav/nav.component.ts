import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/User';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{

  /* PROPERTIES */
  
  //Set property and initialize it for the form manipulation 
  //When the user inputs their username and password, it will be stored in this property 
  //public ANY model = new ANY(){} -> type safety off (any)
  model :any = {};

/*
  //Property to indicate if the user is active 
  //public bool loggedIn = false; 
  loggedIn :any = false; 
*/


  //Setting property to unsubscribe out of the getCurrentUser() resource  
  //currentUser$:Observable<User | null>(null); //cant use null directly, must use RxJS(of)
  //this replaces the need of the 'boolean loggedIn to unsubscribe out of the resource'
  //IIt reads from the account.services.ts the current behavior of the currentUserSource - the logged in   and out is handled by it. You only need to check if it is null or not
  currentUser$:Observable<User | null> = of(null);


  /* CONSTRUCTOR */

  //Injecting the account.services.ts for login 
  //Injecting the router, it comes from the app-routing.module by default if active in your project 
  //Injecting Toastr Service, to display messages to the client based on actions 
  //private AccountService account 
  constructor(private accountService: AccountService, private routing: Router, private toastr: ToastrService){
      //Initializing currentUser$ to the one from the service so we can use it in the HTML site (nav.component.HTML) 
      this.currentUser$ = this.accountService.currentUser$;
  }
  
  /* As soon as Initializes - build in method to run as soon as the service starts  */
  ngOnInit(): void {
    /*
      //No longer needed, as it is handled by the Async Pipe
    //During Initialization, set the current user to true if there is anything in local storage. 
    this.getCurrentUser();
    */
  }

  /*Custom Methods */


//   /*
//     Temporary method as the better approach is to use the Async Pipe (RxJS): Get Current User 
//     - To get the current user, if there is an active user, set the loggedIn boolean property to true
//   */
//  getCurrentUser(){
//   this.accountService.currentUser$.subscribe({
//     next: (user) => {
//       //This is the same as the one bellow, '!!' makes the user into a boolean. If it exists, then true. Else, no
//       // this.loggedIn = !!user;
//       if(user)
//         this.loggedIn = true; 
//       console.log("Logged In: " + this.loggedIn)
//     },
//     error: (error) => {
//       console.log(error);
//     }
//   });
//  }

  //function login(){}
  login(){
    // console.log(this.model);
    //Use the login from the account service and subscribe (arrow functions)
    this.accountService.login(this.model).subscribe({
      next: response => { //if response variable not needed ()=>{} OR _ => {} //'_' means empty, not needed but its a standard 
          console.log(response); //this should return the username and the tokkenPassowrd from the server if the user exists and the password was successfully salted
          //this.loggedIn = true; //user is logged in - //Not needed as async pipe takes care of it (unsubscribing)

          /*
            Angular Routing 
            1. When the user logs in, and is successful, then re-route to another component 
            2. The component name is based on the component path registered on app-routing.module.ts 
            3. Always add "/"
           */
          this.routing.navigateByUrl("/members")
      },
      error: errorResponse => { //()=>{}
        console.log(errorResponse);
        /*HANDLED BY GOTO => _interceptors/error.interceptors.ts 
          - We do not need to throw this particular error back, as it is already handled by the interceptor, else would be duplicate
          
          //Display the error message to the user 
          this.toastr.error(errorResponse.error);
        */
      },

    })
  }

 
  //function logout()
  logout(){
    //remove user from local storage
    this.accountService.logout();
    //this.loggedIn = false; //Not needed as async pipe takes care of it (unsubscribing)

    /*
    Re routing to home page when the user logs out 
      1. "/" makes it go to the base of the page
      2. The initial is set as home page in app-routing.module.ts 
     */    
    this.routing.navigateByUrl("/");
  }
}

//#region Study Notes - Creation of NG components 

  /*
    Creating Components
    To create a component
    1. In termial 
    2. ng g c [name] --skip-tests --dry-run
    3. 
        g - generate; 
        c - component; 
        --skip tests - stops creation of tests file; 
        --dry-run does not make any mdifications, for testing purposes 
    4. ng g c nav --skip-tests
    5. To check commands like in dotnet (ng --help)


    Injecting Services 
      1. Services are injectable, 
      2. this service belongs to account.services
      3. this.accountService (from the injected constructor) is used to invoke the service that returns an observable
      

    Observable Subscriptions .subscribe({})
    1. You must subscribe always to an observable to use the responses in the application, else you wont map the elements 
    2. Subscribe takes 3 main optional parameters:
          1. next 
            =>creates a function/arrowFunction(lambda) and does not return anything (void)
            =>what to do after the user subscribes to the service 
            =>like: store the response in a variable 
          2. error
            =>lambda - in case of error what to do 
            =>() => {}  
            =>for the response => {log the response and do something else}
          3. complete
            =>After the response is returned, if there is error or successful completion. Then, do something else "try,catch,block"
*/



/*
  STUDY NOTES - SUBSCRIPTIONS (RxJS, Pipeline, HTTP REQUESTS) 
  - When subscribing to something you should always unsubscribe to it as well 
  - When you are subscribing to an HTTP request, there isnt much of an issue, as the http request ends. 
    It does not take additional resources so there isnt any issues

  - For your own components(getCurrentUser) though, it is a different story
    1. If you do not unsubscribe there could be memory leak, which will continuously use you resources 
    2. A way to avoid it is by using the Asyn Pipe (rxjs) to unsubscribe automatically 
      1. Initialize a property as observable to get the object from the service 
      2. Need to initialize an observable, either during the property or within the constructor. 
        You cant use null directly to initialize it, even while using union '|'. To do so, you must use an RxJS element (of) 
        i.e. currentUser$:Observable<User | null> = null;
        new i.e. currentUser$:Observable<User | null> = of(null)
          - This reads as: initializing an observable of null. 
      3. In the account.seervice.ts the methods used for logging in and out are defined
        We are using this property to check the behavior and transmited back to the user 
      4. Another way to call this method in the .html side is by setting the constructor to public so it also has access to the injected property in th constructor, it is currently private for security pruposes 
      5. constructor(private accountService: AccountService){ =>
          constructor(public accountService: AccountService){ 
*/




/*
  STUDY NOTES - ROUTING in NG
  1. Routing as service, which is enabled when you have select 'Y' on routing during project creation 
  2. Routing is use to move between components without having to navigate through different buttons 
  3. More notes about this type of routing on: 
      1. app-routing.module.ts
      2. nav.component.html (setting route on nav links)
  2. Steps to enable routin IN-Code (this code)
    1. Inject the router service in the constructor 
        1. (private routing: Router)
    2. invoke the property on the code you want to implement it 
      1. Here is implemented on login()
      2. When the user hits login, and its successful. Then, re-route it to the member component
      3. After Subscribing to the service => On Next() => this.routing.navigateByUrl("/members")
      4. You MUST ALWAYS add '/' in the path, as it takes the absolute value, to make it user to navigate 
      5. the "/members" comes from the path registered on app-routing.module.ts 
      6. If you only set "/" in this.routing.navigateByUrl("/") you will go back to the initial page set in your app-routing.module.ts 
        1. app-routing.mdoule.ts
            1. //Empty route that routes back to the home page => https://localhost:4200/
                {path: '', component: HomeComponent},

*/
//#endregion
