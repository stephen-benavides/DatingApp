/* Any new additions, libraries, and components, must be imported and declared in app.module.ts  */
import { NgModule } from '@angular/core'; //needed for interpolation. appRouting [(ngModel)] 
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'; //Needed for HTTP requests and responses handeling 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //Added for ng bootstrap
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //Added for angular forms 
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
//import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor'; //Custom, added to intercept the errors before they hit the components
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { DatePickerComponent } from './_forms/date-picker/date-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    //MemberDetailComponent, Remove it, to convert it to - STUDY NOTES: Stand Alone Component 
    ListsComponent,
    MessagesComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TextInputComponent,
    DatePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //Module Use for HTTP request transactions 
    //Need to import from @angular/common/http to use this module 
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    
    /*
      //Adding 3rd party modules on Shared Module "Study Notes" below for more info (shared.module.ts => SharedModule)
      BsDropdownModule.forRoot(),
      ToastrModule.forRoot({positionClass: "toast-bottom-right"})
    */
    SharedModule
    
  ],
  providers: [
    // STUDY NOTES: loading ALL INTERCEPTORS in our application in the "entry point" - MORE ON NOTES BELOW 
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



/*
  Study Notes - Explanation on Angular Root Module
    1. This is the root node 
    2. Everything depends on root to allow for SPA functionality 
    3. We added the following imports which already exist in NG but requiere to be explicetely invoked to use
      1. AppRouting 
        1. [(ngModel)] = ""
        2. For 2 way binding between HTML and component
      2. HttpClientModule 
        1. For http requests between client and server 
        2. HttpClient
        3. account.services.ts
      3. BrowserAnimationModule
        1. For Bootstrap implementation 
        2. This was added using the CLI - following the steps in the bootstrap page 
        3. https://valor-software.com/ngx-bootstrap/#/documentation
      4. FormsModule
        0. To use template forms 
          1. Template forms uses the ngModule, as well as the properties directly into the form itself
        1. To use ng(angular) form functionality 
        2. #loginForm="ngForm" => nav.component.html
        3. <Input name="">

      5. ReactiveFormsModule
        1. Use for reactive forms 
        2. Store variables into controllers within the .ts document itself 
        3. Implentation on "register.component.ts"
      


  Installation of 3rd party libraries 
    1. Such as toastr 
    2. In OneNote => Angular => 3rd Party Libraries 
    3. Installing third party libraries such as bootstrap requieres to check the current version of angular and checking a compatible version to install 
	  4. There is always the version and how to install it in the notes of the libraries you want to install 
	  5. Toastr ****
		  1. Library use to display information back to the user 
		  2. How to install 
		  	1. Search angular toastr in google 
		  	2. Go to the github (https://github.com/scttcper/ngx-toastr)
		  	3. Check in the notes the version you need and how to install it 
		  	4. To pick an specific version add @ next to the name with the version you want 
		  	  Npm install ngx-toastr@17 
		  		  - MAKE SURE YOU ARE INSIDE THE CLIENT FOLDER IN THE CLI, else you'll create the folder elsewhere and it wont work
		  	5. Continue following the steps in the github
		  		1) Add the styles y the package 
		  		2) In NG module (app.module)
		  			a) Add the imports for toastr as stated in the steps in the github 



  
  Shared Module 
    1. Creating a new module for upkeep 
    2. It allows to set our custom modules (3rd parties) on a different file, to make things cleaner 
      1. Such as BsDropDOwnModule and ToastrModule 
    3. How to create one 
      1. CLI 
      2. ng g m [folderName/elementName]
      3. ng g m _modules/shared --dry-run 
        1. This will CREATE src/app/_modules/shared/shared.module.ts (192 bytes)
        2. a new FOLDER 'shared' which we do not want. so to avoid that, use the switch --flat 
        3.  $ ng g m _modules/shared --flat --dry-run
            CREATE src/app/_modules/shared.module.ts (192 bytes)
    4. More notes on ./app/_modules/shared.module.ts => STUDY NOTES 

  
    STUDY NOTES - Providers (all interceptors)
      1. Here we load all interceptors in our application 
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

        4. MORE NOTES ON: error.interceptor.ts
*/