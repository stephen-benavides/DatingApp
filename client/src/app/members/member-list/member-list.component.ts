import { Component, inject, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/paginations';
import { User } from 'src/app/_models/User';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //store all members 
  //members: Member[] = []; //==> Converting it to observable variable
  //members$: Observable<Member[]> | undefined;

  members: Member[] = []; //setting as member array for pagination, Notes below - Pagination 
  //Pagination - notes below parameters 
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  //user: User | undefined; - Replaced as we are setting the user on the members.service.ts
  //filter - gender list in anonymous object 
  genderList = [{ value: 'male', display: 'Male' }, { value: 'female', display: 'Female' }];
  
  //Injecting the member service
  //Injecting AccountService (Replaced by moving the pagination into the members.service.ts )
  constructor(private memberService: MembersService, private accountService: AccountService) { 
    //Initializing the user parameters
    //#region Replaced by moving the pagination into the members.service.ts
    //only take a single instance of the current user from the subsuscription from the source and then subscribe again to initialize the properties
    /*
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      //When subscribing we get the user, if it exists, then initialize the UserParams class with the user. ANd, get the user object as well
      next: (user) => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
    */
    //#endregion
    this.userParams = this.memberService.gerUserParams();
  }

  ngOnInit(): void {
    //as soon as the component initializes, run the methods inside 
    //this.loadMember(); //==> Data Caching Notes below

    //As soon as the application begins, call all the members, the observable subscribes by default. Thus, replacing the loadMember() method below
    // (Different from above- Removed the members observable because of 'Pagination' implementation)
    //this.members$ = this.memberService.getMembers();


    //pagination, new invocation of the loadMember() if the signal that contains the pagination does not have data 
    this.loadMembers();  
  }

  //GOTO -> Notes Below (Data Caching)  
  /*
  //Subscribe to get all members 
  loadMember(){
    this.memberService.getMembers().subscribe({
      next: (response) => this.members = response
    });
    
  }
  */
  
  //New implementation of 'loadMember' to implement pagination - Notes below - Pagination
  loadMembers() {
    //if there are no user params, just return
    if (this.userParams) {
      //If we have the user params set them to whatever the user has selected.
      this.memberService.setUserParams(this.userParams);
      //subscribe and set the values for the members amd pagination from the response
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
            
            //Set the current page to be the same as the current page number 
            // This should not be required as its already handled when setting the this.pagination=response.pagination. 
            // But, this has been required as the UI for the pagination does not want to update
            if(this.pagination && this.userParams)
              this.pagination.currentPage = this.userParams.pageNumber;
          }
        }
      })
    }
  }

  //Trigger method that will be executed when the user hits the arrow button to change the page in component.ts
    //event:any because its based on any event send by the client which is interpreted by clicking the arrows, so no need to specify further 
  pageChanged(event: any) {
    //Only run if there are user params AND the current page is not the same as the one being clicked by the client. 
    if (this.userParams && this.userParams?.pageNumber != event.page) {
      this.userParams.pageNumber = event.page;
      //Update the memberseervice pagination
      this.memberService.setUserParams(this.userParams);
      //Reload the current page with the new page number
      this.loadMembers();
    }
    
  }

  resetFilter() {
    //#region Before we wanted to reset the filters by creating a new instance of the UserParams - this is now replaced by members.service.ts which holds this logic for the pagination.
    /*
    if (this.user) {
      //reset the parameters to the original state by creating a new instance with the default data. 
      this.userParams = new UserParams(this.user);
      //reload the member
      this.loadMembers();
    }
    */
    //#endregion
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

}


/* STUDY NOTES - Addional Notes on Components (1)- Members

  1. Always add the "private" when injecting a new service into the constructor of a component, else it wont work 
  2. If you have set up the interceptor in your project, all the errors are handled by the interceptor, so no need to add error on your projject
    but, you can still add a "complete" object 
  3. Inside the methods, for instance the .subscribe(), it takes an observer argument. BUT, by using the {} inside, 
  you get access to a generic object to set properties to. very similar to C# with anonymous objects on LINQ 
    1. C#
      .select(x => new {GenericProperty1 = x.val1, GenericProperty2 = x.val2})
    2. Angular 
      .subscribe({
      next: (response) => this.members = response
    });

  UPDATED - STUDY NOTES - DATA CACHING(2)
    1. In the members.service.ts we are loading all information into a property.
    2. Therefore we can use it as an observable object, so we can use an observable variable (members$) so it will be easier to subscribe and unsubscribe automatically 
    by using the async pipe 
    3. More notes about this type of variables on "nav.component.ts" => currentUser$
    4. Now we can open the member-list.component.html (this template) and change the member using the async pipe so it will subscribe and unsubscribe automatically. 



    STUDY NOTES - PAGINATION (7)
      1. This application prior to the pagination elements was breaking because on the members.service we removed 
      the implementation of the members observable as is 
      2. To solve the issue we did the following: 
        1. commented on ngInit() => this.members$ = this.memberService.getMembers();
        2. Created a new property 
        3. Created the method loadMember() to pass the pagination elements to 
        4. Remove the this.members$ observable from the .html - 
          1. FROM THIS: <div class="col-2" *ngFor="let member of this.members$ | async">
          2. TO THIS: <div class="col-2" *ngFor="let member of this.members"> 
            - Need to remove the async pipe - members is the same as is the name of the property where we are laoding the members here members: Member[] = [];
*/