import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  standalone: true, //Set to true to indicate this is a standalone component 
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],

  //Creating custom impot for our standalone component 
  imports:[
    //Needed for angular directives (*ngIf)
    CommonModule, 
    //Needed for the tabset (ng bootstrap tabs)
    TabsModule,
    //ng gallery module - Notes Below
    GalleryModule
  ]
})
export class MemberDetailComponent implements OnInit {

  member: Member | undefined;
  images: GalleryModule[] = []; 

  //Injecting the Active Route to ger the parameters from the route
  //Injecting the member service to get the user from the name in the pparameter
  constructor(private route: ActivatedRoute, private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    /*STUDY NOTES - ACTIVATED ROUTE
      1. Get the username parameters from the active route
      2. This comes from: path: 'members/:username', component: MemberDetailComponent
      3. ON: app-routing.module.ts 
      - The .get('username') MUST HAVE the same as the parameter in the app-routing.ts, else it wont work: "/:username"
    */
    const username = this.route.snapshot.paramMap.get('username');

    //if there is no paramter, exit the method
    if (!username)
      return;

    //With the parameter, call the server to get the member, and initialize the member in this page 
    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.member = member,
        //When we get the user, we are loading all the available images into the GalleyModule
        this.getImages()
      }
    });

  }

  getImages(){
    /*STUDY NOTES -  GalleryModule - Populate our images array to display the photos back to the user*/

    //if no member, exit 
    if(!this.member)
    return;
    //If we have a member, then for each photo available, add the source to the gallery module array property 
    for(const photo of this.member.photos){
      //Add a new image through the ImageItem, belongs to the GalleryModule Array
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))
    }
  }

}

/* STUDY NOTES - Stand Alone Component TS
  - Detailed notes on OneNote > Angular > Components > STANDALONE COMPONENTS
  - Allows us to create component that are not attached to an ng module, thus can operate on their own

  STUDY NOTES - GalleryModule
    1. https://ngx-gallery.netlify.app/#/getting-started/gallery
    2. To use it we need to create a standalone component (this)
    3. Here we are setting this component similar to a shared.module.ts, to import the packages that we are going to be using
    4. Then you can follow the notes on this component .html 
    5. we need to load our images at run time 
*/
