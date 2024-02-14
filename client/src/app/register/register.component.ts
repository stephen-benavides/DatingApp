import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_service/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  /* PROPERTIES */
  /*
    - Place holder for the model that the user is interacting with
    - needs to be initialized (empty) cant be null
  */
  model :any = {}; 
  /*
    - Input Property [Declarator] (Temporary) => not needed because we do not requiere to pass the users into this form, only for testing purposes 
    - Parent to Child Communication
    - More Information on home.component.html => Study Notes
    
    @Input() usersFomHomeController: any;
   */
  

  /*
    - Output Property 
    - Child to Parent Communication
    - More Information on home.component.html => Study Notes
  */
 @Output() cancelRegister = new EventEmitter();



  //ctor
  //Inject the service so you can use it in this register component 
  //Injecting ToastrService to display messages to the user 
  constructor(private accountService : AccountService, private toastr: ToastrService) {  
  }
  
  ngOnInit(): void {
  }

  //When user hits register
  //public void Register()
  public register(){
    // console.log(this.model); //DEBUG
    //us the register service to register the user that is passed to the model (observable)
    this.accountService.register(this.model).subscribe({
      //next:() had 'response' in it but as console.log has been commented out, we do not need it anymore, so empty is fine
      next:() =>{
        /* Console Log DEBUG => explanation on usage for RxJS in (account.services.ts => register() return region)
        console.log(response);
         */
        
        //close register form after completion
        this.cancel();
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error.error);
      
      }
    })
  }
  //To cancel registration page and go back
  cancel(){
    // console.log("cancelled");
    /*
      Let the output property know that the event has been cancelled 
      - It can emit any value, in this case a boolean of false because the property 
      that listenes to this output in the home page is using boolean to determine if the window should be displayed or not
    */
    this.cancelRegister.emit(false);
  }

}
