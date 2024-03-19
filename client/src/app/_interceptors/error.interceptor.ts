import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    //Injecting the rooter - to redirect the user if we need to based on the error from the API 
    //Inject toastr - to display error messages back to the user (GOTO: app-module.ts)
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Piping the return, because we are intercepting the erros that are comming in after sending the request
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //for each error of type HttpErrorResponse (need to specify, else generic object), then, if an error exists: 
        if(error)
        {
          //switch based on the status of the error 
          switch(error.status)
          {
            //INFO ON THIS ERROR CODES IN: app => errors/test-error => test-error.component
            //There are 2 type of 400 errors (buggy controller || error module). Simple error, and array of objects that contain errors (model validation)
            case 400: 
            {
                //Handeling array of errors object (error, within errors within the errors) (generic, always the same when handeling the errors from the API)
                if(error.error.errors){
                  //add the errors in a empty array
                  const modelStateErrors = [];
                  for(const key in error.error.errors){
                    //check if the array of errors has our key, if it does, add it to the empty array
                    if(error.error.errors[key]){
                      modelStateErrors.push(error.error.errors[key]);
                    }
                  }
                  //throw the array of errors for our interceptor to catch. to let the user know they've done something wrong 
                  throw modelStateErrors;
                } 
                //if we do not have an array of error objects. THEN is a normal 400, not an array
                else{
                  //display as a toastr the error message and status code back to the user 
                  this.toastr.error(error.error, error.status.toString());
                }
                break;
            }
            
            case 401: 
            {
              this.toastr.error('Unauthorized', error.status.toString());
              break;
            }

            case 404: 
            {
              //We want to redirect the user to another location if 404 
              this.router.navigateByUrl('/not-found');
              break;
            }
            
            case 500:
            {
              //GO TO STUDY NOTES BELLOW for "navigationExtras"
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break
            }
            default:
            {
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
            }
          }
        }
        //Need to throw the error at the end, otherwise 'catchError' method will complaint 
        throw error;
      })
    );
  }
}


/* STUDY NOTES - "Error Handeling Interceptors" - Usage and implementation of interceptor to handle HTTP requests and responses 

  INTERCEPTORS 
    1. HTTP Interceptors in Angular are classes that implement the HttpInterceptor interface. 
      Intercept and handle HttpRequests and HttpResponses 
    2. They can be used to perform various tasks related to HTTP requests and responses, 
      such as adding headers, handling errors, modifying the request or response data, logging, 

    3. This is a generic class, which can be used in any other application with minimal to no changes 

    4. Creation:
      1. IN CLI:
        1. ng g interceptor _interceptors/error --skip-tests --dry-run

    5. Our Http Client returns Observables (GOTO: _service/account.service.ts), AND in order 
      to modify an observable, open the pipe. Use the pipe to catch any errors, within this incerceptor 
    6. FROM: return next.handle(request) => return next.handle(request).pipe()

    7. This Interceptor contains a list of ALL the possible error messages that we can expect in our application 
      So we can redirect or display (toastr) to the user error messages 
    
   

    7. COMPLETING YOUR INTERCEPTOR 
      1. After completing the interceptor you need to attach it to the current process 
        1. Go to app.module.ts 
        2. Inside providers array
          1. It comes by default
          2. providers: []
        3. Specify the interceptor inside the provider array as an object {}
          {provide: HTTP_INCERCEPTORS, useClass: ErrorInterceptor, multi: true}
            1. provide 
              - constant indicating the type of object that has been created. 
              - For Interceptor IS HTTP_INTERCEPTOS
            2. useClass 
              - the name of the class that contains the logic for the interceptor (this class) 
              - ErrorInterceptor
            3. multi 
              - angular comes with its own interceptors, 
              - by setting 'true' you are ADDING to the current interceptors instead of REPLACING them. 
        4. NOTE:
          1. By Attaching the interceptor to your components, any other response that is intercepted is going to be hanlded by default by the interceptor(this)
          2. So, for intance, when using a module that returns a response that might have an array of errors, such as ERROR 400 (above). THen, the response 
            in the module is no longer going to be an array of objects (because validations errors can be multiple at once.
              such as errors with username and password in the same response) but what is supposed to be returned by this interceptor if there is an error that handles 
            the error code. 
          3. Interceptor handles how ANY subsequent objects are used throughout your application
          4, Think of interceptor as services, with the difference that a service must be attached to each module individually 
            whereas an interceptor you only need to do it ONCE in app.module.ts => providers[] and will affect anything related to the intercepted object. 
            In this interceptor, that will be errors as per the .pipe(error.catchError()) in the request "httpRequest: HttpRequest"

  8. This interceptor class was tested using:
    - MODULE: _error/test-error/test-error-component.ts/html


  9. What are navigationExtras?
    1. Navigation extrax are used to pass additional metadata about the request/response. 
    2. It states how a request is going to be navigated by the router 
    3. In this case we set a property that states the error (server error) in detail, it would look just like with postman. 
    4. Really useful to get a LOT of information as possible on a problem so it will be easier to fix 
    5. When we navigate to the linked error page ('/server-error'), it will have access to the information about the error (through the navigation extras)
      1. To access this, it needs to be injected in the component (through the constructor) 
      2. In this case, it has been injected into the server-error.component.ts through the Router class. 
      3. Go there to see more details on how it has been implemented 
      4. We only get one specific chance to access the navigation extras, and that is through the constructor 

*/