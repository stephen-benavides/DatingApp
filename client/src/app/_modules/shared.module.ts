import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  declarations: [], //Any component that we created 
  imports: [
    CommonModule, //Must always be provided on any module you create 
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({positionClass: "toast-bottom-right"}), //Set the position of the toastr in the screen, for all toastr objects
    TabsModule.forRoot(), //To use the tabs module from ngx bootsrap - member-edit.component.html
    NgxSpinnerModule.forRoot({type: "line-spin-clockwise-fade"}), //To use the angular spinner to show loading screen 
    FileUploadModule,
    BsDatepickerModule.forRoot(), //For the date picker - GOTO: STUDY NOTES: TYPE - DATE (1)
  ],
  //As this is the 'sharedModule component' which we need to load in the app.component.ts, then the modules above, must also be included 
  //here to be used outside this module. 
  exports: [
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    NgxSpinnerModule,
    FileUploadModule,
    BsDatepickerModule
  ]
})
export class SharedModule { }


/* STUDY NOTES - Usage of share modules to clean NG code 

  Share Modules 
    1. Use to clean up your code 
    2. set in the imports the modules you want to store here 
      1. The CommonModule MOST always be there, otherwise the shared module won't work. 
    3. In the exports you need to set the modules that are going to be used by the parent module (app.module.ts)
      1. In this case, it will be all of them except for the CommonModule, which is created by default by the system
      2. you do not need to specify "forRoot()" in the exports 
      3. you need to create the exports array and pass the name of the modules you want to use in your parent module

    Creating a new Module using "--flat" 
      1. Usually, it will create a new folder besides the one you are inputting in the CLI 
      2. To avoid the creation of any new folders that you might not want when generating a new angular object, use the --flat flag 
        1. $ ng g m _modules/shared --flat


  STUDY NOTES - Imported Modules in Shared Module.ts

    1. BsDropDownModule
      1. To use angular bootstrap drop down menus 
      2. From: https://valor-software.com/ngx-bootstrap/#/components/dropdowns?tab=api

    2. toastr
      1. Library use to display information back to the user in the form of small unnintrusive messages 
      2. From: https://github.com/scttcper/ngx-toastr
      3. toastr Implementation on:
        1. nav.component.ts => login => error
        2. register.component.ts => register => error
      4. Change the position of the message by overriding css class inside the initialization of toastr in this page: 
        ToastrModule.forRoot({positionClass: "toast-bottom-right"}) => positionClass 
      5. To use the service you must inject it in your components, like any other service
      5. Check in the notes the version you need and how to install it 
      6. To pick an specific version add @ next to the name with the version you want 
        	1. Npm install ngx-toastr@17 
          2. MAKE SURE YOU ARE INSIDE THE CLIENT FOLDER IN THE CLI, else you'll create the folder elsewhere and it wont work
      7. Continue following the steps in the github
    
    3. ngx-bootstrap (TabsModule) 
        1. https://valor-software.com/ngx-bootstrap/#/components/tabs?tab=api
        2. Check if you already have ngx bootstrap installed (in the app.module.ts(from 'ngx-bootstrap/) folder see if bootstrap is already there)
            1. If you do, just add the imports in the documentation 
        3. After installing tabset to your modules, you get access to the <tabset> to set tabs in the page
        4. Current implementation on member-detail.component.html

    4. NgxSpinnerModule
      1. Needed to display laoding screens 
      2. forRoot() is use to pass a global configuration that will override any other configuration. It is used to make sure the .css file is going to be use 
        throghout 

    5. FileUploadModule
      1. From ng2-file-upload 
        - https://github.com/valor-software/
        - https://valor-software.com/ng2-file-upload/
      2. It is use to upload files into the system
      3. No need to specify the @ when installing it through npm 
      4. Taking the code from the valor page, we can copy paste the code, make sure to do the necessary changes, other than that the variables must be the same. 
      5. Initialization and more notes on photo-editor.component (html and ts)

*/