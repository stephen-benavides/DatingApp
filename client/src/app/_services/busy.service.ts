import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  //track how many requests are in the queue to the loading screen, if the count is greater than 0, show the loading screen (spinner)
  busyRequestCount = 0;

  //Injecting the NgxSpinnerService so we can display and hide the spinner 
  constructor(private spinnerService: NgxSpinnerService) { }


  //This indicates the property of the active spinner that we are going to be using in our application 
  busy(){
    //Increment the as the method implementing this will have an active spinner 
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      //We already have the global on shared.module.ts, so it might not be necessary, but just in case for redundancy, as we are going to use the same in the entire app
      type: "line-spin-clockwise-fade",
      //White background 
      bdColor: "rgba(255,255,255,0)",
      //Color of the spinner 
      color:"#333333"
    })
  }

  idle(){
    //Decrease the count on idle 
    this.busyRequestCount--; 
    //if the count is 0, then hide the spinner 
    if(this.busyRequestCount <= 0){
      //we might have more https requests that are resolving, so if the number is 0 or less, then just set the request count to 0
      this.busyRequestCount = 0;
      //Hide the spinner 
      this.spinnerService.hide();  
    }
  }
}


/*
STUDY NOTES - NGX SPINNER (Loading Screens) Service 
  1. Using service to inject the loading screens into location that communicate with the server or any other places that might 
  requiere the client to wait for objects to load
  2. This service will be in charge of showing and hiding the spinner based on the count on the number of request. 
  3. We are using this type of count because we can have multiple requests at the same time. We need to make sure to handle all of them. 

  4. Currently implementing this spinner on an interceptor (_interceptors/loading)
*/