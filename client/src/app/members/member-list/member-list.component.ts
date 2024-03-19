import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_service/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //store all members 
  members: Member[] = [];
  
  //Injecting the member service
  constructor(private memberService: MembersService){ }

  ngOnInit(): void {
    //as soon as the component initializes, run the methods inside 
    this.loadMember();
  }

  //Subscribe to get all members 
  loadMember(){
    this.memberService.getMembers().subscribe({
      next: (response) => this.members = response
    });
    
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
*/