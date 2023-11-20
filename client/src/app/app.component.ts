import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  //Properties  
  title : string = 'Dating App';
  users: any; //turning off TypeScript Safety, we are declaring a variable like in JS 

  //Constructors
  //Injecting Http request into component through a constructor 
  //This means ctor(private HttpClint http)
  constructor(private http: HttpClient) {}
  

  //Methods 
  //public void ngOnInit()
  ngOnInit(): void {
    //By just getting the element you dont do anything with the resource
    //Need to subscribe to the request to actually call it and store it in a variable
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
  }
}
