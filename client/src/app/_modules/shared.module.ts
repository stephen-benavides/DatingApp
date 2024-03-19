import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  declarations: [], //Any component that we created 
  imports: [
    CommonModule, //Must always be provided on any module you create 
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({positionClass: "toast-bottom-right"}), //Set the position of the toastr in the screen, for all toastr objects
    TabsModule.forRoot() //To use the tabs module from ngx bootsrap
  ],
  exports: [
    BsDropdownModule,
    ToastrModule,
    TabsModule
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
*/