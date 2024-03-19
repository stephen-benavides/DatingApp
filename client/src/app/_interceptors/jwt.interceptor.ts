import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_service/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  //Injecting account service 
  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //as we are sending data with the request itself, we are writing our logic BEFORE the return statement 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        //if the user exists as, next can take User or Null in this context 
        if(user){
          //clone the request to make the necessary changes to it first 
          request = request.clone({ //GOTO: Notes Bellow 
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
        }
      }
    });

    //Leave the return as is, as we are not changing or intercepting anything from the server 
    return next.handle(request);
  }

  /*STUDY NOTES - Interceptors 2 - intercepting the request and adding headers before it hits the server
    0. If you want to know more about interceptors go to: _interceptos > error.interceptors.ts 
    1. In error.interceptors we are doing the oposite, as we are handeling the errors that we receive from the server
      1. The errors that come from the server are handled within the return request for the same reason 
    2. Here we are handeling with the request before to submit it along the normal request to the server. Thus, before the return statement

    METHODS USED:
      1. pipe(take(1))
        1. Indicates that the service is going to unsubscribe automatically after taking it once 
        2. You can add the number of times the observable can run without unsubscribing by modying the number inside the 1 
        3. In RxJs - anything inside the pipe indicates changes to the request before the data is subscribed (other components that implement the same behavior has more notes on it)
      2. request.clone({})
        1. .clone makes a clone of the request to change the values per reference 
        2. If you want to modify the request, you must clone it first to get access to its properties 
        3. In this case we are adding the headers to set the authorization like the Bearer token. 
          1. _service => members.service.ts => getHttpOptions()
        
        4. Authorization: `Bearer ${user.token}`
          1. Same location as the getHttpOptions() above to get the token from the local storage / user 
          2. YOU MUST USE the '`' (1st symbol on keyboard before the 1)
          3. This allows the use of "interpolation $" in the string in angular, otherwise it will be a regular string 
          4. This avoids concatination 
  */
}
