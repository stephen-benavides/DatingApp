import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './_service/account.service';
import { User } from './_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  //Properties  
  //Properties can be invoked in the .html file by using {{propertyName}}
  title : string = 'Dating App';
  users: any; //turning off TypeScript Safety, we are declaring a variable like in JS 

  //Constructors
  //Injecting Http request into component through a constructor 
  //Injecting account service to check if the user has logged in into the application 
  //This means ctor(private HttpClint http):
  constructor(private http: HttpClient, private accountService: AccountService) {}
  

  //Methods 
  //public void ngOnInit()
  // As soon as the application is running, execute these methods to get the user information in the client's local storage to store in the service 
  //SERVICES until the application is no longer running, so we can use this throughout the APP
  ngOnInit(): void {
    //this.getUsers(); no longer implementing this method in this component directly 
    //If we have an user in local storage, then get it when refreshing the page 
    this.setCurrentUser();
  }
/* Not needed for this module, the users are handled by the members.service.ts
  //public void GetUser() => Transferring method in home.component.ts- Notes about Input from parent to child there
  getUsers(){
    //By just getting the element you dont do anything with the resource
    //Need to subscribe to the request to actually call it and store it in a variable
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: response => this.users = response, //()=>{} (arrow function / lambda)
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
  }
*/
  //public void SetCurrentUser()
  setCurrentUser(){
    /*
      This returns null, so creating a new variable to check its value, 
      and then parsing it to json if exists
      - You can overwrite type script, even with exstrict mode turned on by using the exclamation mark (!)
        - const user:User = JSON.parse(localStorage.getItem('user')!);
        - This is not advisable, as you are stating that as a developer you know best. 
    */
    // const user:User = JSON.parse(localStorage.getItem('user'));

    //Explicit approach to get the user 
    const userString = localStorage.getItem('user');
    //If user is null return
    if(!userString){
      return; 
    }
    //else set the user 
    const user:User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}

/*STUDY NOTES - Setting the current User from Local Storage in the browser 

  - Main Component that run as soon as the application starts

*/