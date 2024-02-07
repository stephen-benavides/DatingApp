import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //properties 
  //public bool registerMode //if true show the register menu
  registerMode: boolean = false;
  //Get the users from the API //- More Information on home.component.html => Study Notes
  users:any;


  //ctor
  //Injecting HttpClient for the getUsers
  constructor(private http: HttpClient){

  }
  

  //OnInint - needs to implement OnInit Interface
  ngOnInit(): void {
    this.getUsers(); //For the input, you need to invoke the method you want to pass on ini 
  }


  //CustomMethods
  public toggleRegisterMode(){
    //when invoked, set the property 'register mode' to the oposite of what currently is
    this.registerMode = !this.registerMode;
  }

  //Passing the Users from the Home Component to the Register Component (Child)
  //public void GetUser()
  getUsers(){
    //By just getting the element you dont do anything with the resource
    //Need to subscribe to the request to actually call it and store it in a variable
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: response => this.users = response, //()=>{} (arrow function / lambda)
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
  }

  /*
    Method to cancel the RegisterMode 
    - Set the property to false 
    - Using to map the output from the register component to the home component 
    - Communication from child to parent 
    - More information on register.component.html
   */
  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }

}
