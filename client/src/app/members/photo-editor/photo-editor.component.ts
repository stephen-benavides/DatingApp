import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { User } from 'src/app/_models/User';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  //Get the member photos from the tab
  @Input() member : Member | undefined;

  //Properties that nee to be initialized for the current snipet from the main site for ng2-file-upload works
  //More notes on shared.module.ts > ng2-file-upload
  uploader:FileUploader | undefined;
  hasBaseDropZoneOver:boolean = false;
  baseUrl = environment.apiUrl; //=> our own, to update the photo to the server 
  user: User | undefined; //=> to access the user token, as we cant 'intercept' this component


  //Injecting the account service
  //Injecting the member service - to set the main photo
  constructor(private accountService: AccountService, private memberService: MembersService){
    //subscribing to the account inside the constructor once(1) using the account service pipeline, we want to initialize the user
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if(user){
          this.user = user; //Initialize the user property 
        }
      }
    });
  }

  ngOnInit(): void {
    //Initialize the uploader as soon as this component is initialize. 
    this.initializeUploader();
  }

  //Methods used strictly by the code snipet taken from ng2-file-upload. This is standard
  fileOverBase(e : any) : void{
    this.hasBaseDropZoneOver = e;
  }
  
  initializeUploader(): void{
    //how the files that are being uploaded will be handled 
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/add-photo", //=> server
      authToken: 'Bearer ' + this.user?.token, //=> cant use the interceptor for the http request, this needs to be done manually. always have the ' ' after the bearer, else it wont work
      isHTML5: true,
      allowedFileType: ['image'], //=> In this case accepting all images 
      removeAfterUpload: true, //=> once it has finished uploading, remove the file from the list 
      autoUpload: false, //=> requiere manual upload to actually do so 
      maxFileSize: 10 * 1024 * 1024 //=> max sized allowed by cloduinary 10mb (3rd party service / server side)
     });

     //what to do after adding the file - THESE ARE ALL EVENTS, SO WE CAN USE THE ARROW FUNCTION ()=>{}
     this.uploader.onAfterAddingFile = (file) => {
      //This is done to avoid having to change or Cross Origin Resource Sharing (CORS) by removing any credentials from the image
      file.withCredentials = false;
     }
     //What to do after updating the file sucessfully 
      //none of the parameters onSuccessItem are optional, so you must pass all of them 
     this.uploader.onSuccessItem = (item, response, status, headers) => {
      //If we have a response, parse the response, which will be a successful photo, and add it into our server  
      if(response){
        const photo = JSON.parse(response);
        //Update the member that we are receiving (Input variable)
        this.member?.photos.push(photo);

        /*
          If it is the first photo by the user, which should be.
          Then, update the member protrait and the user menu on top portrait to this photo 
        */
        if (photo.isMain && this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url; 
          this.accountService.setCurrentUser(this.user); //Notes on (setMainPhoto())
       }
      }
     }
  }

  //Set the main photo 
  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe({
      /*
        WHAT DO WE WANT TO DO NEXT? - we dont get anything back from the server with this request
          1. For this update we need to change all places where the main picture is used
      */
      next: () => {
        if(this.user && this.member){ //Only if we have a valid user and an active member, to avoid TS issues
            this.user.photoUrl = photo.url; //Update the main photo from the profile (member-edit.component => PhotoURL) =? Where the location, and all editable fields are
            this.accountService.setCurrentUser(this.user); //To change all elements that interact with the user photo, we are updating eveyrthing with the current user, the current main photo //this is because the navbar uses the current picture for its component
            this.member.photoUrl = photo.url; //For the member cards that uses this photo
            this.member.photos.forEach(currentMemberPhoto => { //update the member photo collection, to the new main photo
              if(currentMemberPhoto.isMain){
                currentMemberPhoto.isMain = false;
              }
              if(currentMemberPhoto.id === photo.id){
                currentMemberPhoto.isMain = true;
              }
            })
          }
      }
    });
  }

  deletePhoto(photoId: number){
    //subscribe 
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        //If there is a member, 
        if(this.member){
          //redraw the the member photos without the one we want to remove for the client site
          //filter - returns the elements in the array based on the callback function, in this case, returns the photos where the id is the one we want to remove 
          this.member.photos = this.member.photos.filter(p => p.id !== photoId);
        }
      }
    });
  }
}
