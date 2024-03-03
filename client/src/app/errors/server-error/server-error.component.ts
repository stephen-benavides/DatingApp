import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  //Property to display the data from the intercepted error (error.interceptor.ts => Case 500)
  error : any; 

  //We only got access to the navigation extras WHEN we are routed by the error.interceptor.ts - IF THE PAGE IS REFRESHED then we no longer have access to it
  constructor(private router: Router){
    //Passing navigation Extras from error.interceptor.ts => Case 500: Server Error 


    //Get the current elements pass from the error.interceptor.cs as soon as it hits the component. 
    const navigation = this.router.getCurrentNavigation();
    //Initialize the error using navigationExtras  (GOTO error.interceptor.cs for more info) so we can display it in the .html of this component 
      //The data inside the navigation might be null, so best practice is to use the nullable type (?)
        //The ['error'] comes from "const navigationExtras: NavigationExtras = {state: {error: error.error}}; GOTO: ERROR.INTERCEPTOR.TS". The error in the property defined in the state (error:). This is the string key used in the indexer. 
    this.error = navigation?.extras?.state?.['error'];

  }

  ngOnInit(): void {
  }
}
