import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  //Injecting our spinner service implementation (busy) 
  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //Anything before the return is something is being sent to the server

    //If we send a request to the server, then set it to busy
    this.busyService.busy();

    //Anything after the return is something that we are alreeady getting from the server and we want to implement additional logic to it befre our services gets it
    return next.handle(request).pipe(
      //In the upcomming request that is comming from the server, adding delay to "imitate" an actual request 
      delay(1000),
      //After it comes from the server, then we can say it has finalize, so we can set the spinner service to iddle 
      finalize(() => {
        this.busyService.idle();
      })
    );
  }
}

/*
STUDY NOTES - NGX SPINNER (Loading Screens) (2) Interceptor 
  1. We are implementing our service to invoke the spinner in this interceptor 
  2. Everytime a new http request is sent to server we are adding a new counter to the busyCounter in the busy service 
  3. When the request has finalize, we remove a counter, and check if the counter is 0 to hide the spinner 
  4. We can have multiple request, so this is necessary to handle all of them.

  NOTES:
    - Remember to load your interceptor in app.module.ts 
    - AND to initialize the spinner globally for all te application
      - Because it is to all the application then the "app.component.html", as it will load at the beggining of the application (for all components)
*/
