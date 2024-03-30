import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { User } from 'src/app/_models/User';
import { Member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  
  //#region Properties  
  /*
    STUDY NOTES: Null is not the same as undefined, 
    if something is undefiined, it means it does not have anything. 
    If somethiing is null, we must initialize it to null, as it has a VALUE of null. 
  */
  user: User | null = null;
  member: Member | undefined;
  //We want to have access to the form whose id is 'editForm' --GOTO Notes Below
  @ViewChild('editForm') editForm: NgForm | undefined; 
  //Property (decorator) to make it so the browser checks if you have unsaved changes. You only need to initialize it here, and that's it. GOTO NOTES BELOW 
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  //#endregion
  

  //Injecting AccountService, to get the user that logged in 
  //Injecting MemberService, to get the member from the user
  //Injecting ToastrServices, to display messages to the user 
  //Injecting Router Service to route the member to the member card page
  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService){
    //As soon as this loads, initialize the user that logged in 
    /*
      1. We only need to subscribe 1, thus using RxJS to subsribe only 1 time, and then unsubscribe 
     */
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (response) => {
        this.user = response; //This can be user or null. Thus the property user is set to null and initialized to null 
      }
    });
  }

  ngOnInit(): void {
    //Initialize the load member after resolving the logic inside the constructor to get the user from the local storage
    this.loadMember();
  }

  //Get the member from the API
  loadMember(){
    //If the user is null or undefined, then return 
    if(!this.user)
      return; 
    this.memberService.getMember(this.user.username).subscribe({
      next: (response) => { //we get the member from the response, this can be named either of. 
        this.member = response; 
      }
    });
  }

  //Update the member in the API
  updateMember(){
    //console.log(this.member)
    /*
      //Return if no member is available
      if(!this.member)
        this.toastr.error("Member does not exist");
    */

    /*
      cant use member in the updateMember beacuse we cant initialize it if it is null
      Therefore, we are using the actual form, which is of type 'member' because all objects are populated from the member property. 
      As the parent we can use it, we are also implementing the same naming convention as the Member model. 
     */
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => { //the _ is used when is empty, you can also use the () instead, does not make a difference 
        this.toastr.success("Profile updated sucessfully");
        //Reset the child form in .html to the current values in the member object, to get the same state. GOTO - Notes Below 
        this.editForm?.reset(this.member);
      }
    });
    
  }


  /*
    - STUDY NOTES: Levels Of Execution in Angular 
      1. It is the same as C#
        1. First, the constructor 
        2. Then the objects iniside the ngOnInit();

      2. We do no have access to the username of the user for the current user to edit the page; 
        SOLUTION:
          1. Get the user from the AccountService, as is the only way we can gat the username
          2. With the username, use the MembersService to GET the Member and all its details 

        
    - STUDY NOTES: Using @ViewChild From Angular Core 
      1. We want to be able to access the current instance of the form, if changes where made
      2. To do that we need access to the .html component 
      3. To get access to it we can use the @ViewChild() property to get access to the template of the child of this component 
        1. Similar to ASP.NET web forms, this .ts, which is the code behind controls the .aspx which is a child of it. 
      4. Example; 
        @ViewChild('editForm') editForm: NgForm | undefined; 
        1. It is of type NgForm, and could laso be undefined at the moment of creation 
        2. We need to pass in '' the id of the control we want to access 
      5. When the form has been changed, we want to make sure the changes remain.
        Thus, on save of the form, we want to pass the current changes in the member property to this child to make sure the current state remains 
      6. We have access to ALL methods available to the form in the member-edit.component.html such as:
        - .dirty
      7. In this case we want to use the reset method to reset the form on submit to the same values currently stored in the member object from the form
          1. this.editForm?.reset(this.member); => updateMember()
          2. By doing this, we reset the status of 'dirty' in the form. Without it, the Alert message will remain, as the form is considered dirty
  
  
    - STUDY NOTES:  Using @HostListener() Property To let the browser ask if you want to leave page
      1. If you have a dirty form (form that has unsaved - pending changes in). Then we can make the broser ask the user if they are sure they want to leave
      2. For this check you only need to initalize it in the property and forget about it. 
        1. No other place in the app does this needs to be configured 
        2. Only on the target component.ts (member-edit.component.ts) 
      3. This is standard on every component: 
          @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
          if(this.editForm?.dirty){
            $event.returnValue = true;
          }
      4. YOU CANNOT change the CSS of this check, as it is created by the browser directly.
  }

  */
}


