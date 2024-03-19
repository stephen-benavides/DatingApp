import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  //Initialing variable for server communication 
  baseUrl : string = environment.apiUrl;

  //Injecting http service
  constructor(private http: HttpClient) { }


  //Get all Members, need to pass thw JWT bearer token as options to authenthicate, as requested by the server.  
  //https://localhost:5001/api/users
  getMembers(){
    /* the 'options' in the request are handled by jwt.interceptor.ts now
    return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions());
    */
    return this.http.get<Member[]>(this.baseUrl + 'users'); //options are handled by the interceptor
  }

//get a single member, same JWT 
  getMember(username: string){
    /* the 'options' in the request are handled by jwt.interceptor.ts now
    return this.http.get<Member>(this.baseUrl + 'user/' + username, this.getHttpOptions());
    */
   return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  //#region Options to get JWT Authorization Token - Replaced by _interceptors > jwt.interceptor.ts

  //Temporary method to get the JWT token for the authenthication to the server

  // getHttpOptions(){
  //   //get the current user stored in the client's browser local storage
  //   const userString = localStorage.getItem('user');
  //   //If we do not have the user, then return 
  //   if(!userString){
  //     /*
  //       This check is necessary for typescrypt (TS) benefit, as the check is not really necessary 
  //       for us because all our users must be authenthicated to get up to this point 
  //         - Authenthication is done on: app.component.ts => setCurrentUser()
  //      */
  //     return;
  //   }
  //   //convert into JS object
  //   const user = JSON.parse(userString);

  //   return{
  //     /*
  //       Return the JWT token bearer information 
  //       - STUDY NOTES: Retrieving JWT in the client site 
  //         1. It must have the space at the end on 'Bearer '
  //         2. The "options" in the get method in the getMembers() take the headers as an option type 
  //         3. Authorization must be spelled as is, be careful as TS won't help with this syntax. 
  //      */
  //     headers: new HttpHeaders({
  //       //Check on (Client's browser F12 > Network > users > headers tag > Authorization)
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }

  //#endregion
}
