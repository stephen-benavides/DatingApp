import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent implements OnInit {
  
  strBuggyControllerURL : string = "https://localhost:5001/api/buggy";

  //parameter to store validation errors 
  arrValidationErrors: string[] = [];

  constructor(private http: HttpClient){

  }

  ngOnInit(): void {
  
  }
  
  get401Secret(){
    this.http.get(this.strBuggyControllerURL + "/auth").subscribe({
      //It is never going to hit next, because anything other than 20X (ok) is considered an error by angular 
      next: (response) => {console.log(response)}, 
      error: (error) => {console.log(error)},
      complete: () => {console.log("Request Completed")}
    });
  }

  get404ErrorNotFound(){
    this.http.get(this.strBuggyControllerURL + "/not-found").subscribe({
      //It is never going to hit next, because anything other than 20X (ok) is considered an error by angular 
      next: (response) => {console.log(response)},
      error: (error) => {console.log(error)},
      complete: () => {console.log("Request Completed")}
    });
  }

  get500ServerError(){
    this.http.get(this.strBuggyControllerURL + "/server-error").subscribe({
      //It is never going to hit next, because anything other than 20X (ok) is considered an error by angular 
      next: (response) => {console.log(response)},
      error: (error) => {console.log(error)},
      complete: () => {console.log("Request Completed")}
    });
  }

  get400BadRequest(){
    this.http.get(this.strBuggyControllerURL + "/bad-request").subscribe({
      //It is never going to hit next, because anything other than 20X (ok) is considered an error by angular 
      next: (response) => {console.log(response)},
      error: (error) => {console.log(error)},
      complete: () => console.log("Reuqest Completed")
    });
  }

  get400ValidationError(){
    //posting empty model to retrieve the error validation error from the API
    this.http.post("http://localhost:5000/api/account/register", {}).subscribe({
      next: (response) => {console.log(response)},
      error: (error) => {
        //console.log(error)
        this.arrValidationErrors = error;
        /* NOTES:
        
          GOTO => _interceptos/error.interceptor.ts for more detail explanation as to why this comes as a single array.

            Interceptors are created by us to intercept all HTTP requests and responses and handle errors accordingly 
            * This would originally throw back an array of array of objects, BUT due to the interceptor in charge 
              of exceptions it is easier to read and handle 
         */
      },
      complete: () => console.log("Reuqest Completed")
    });
  }
}
