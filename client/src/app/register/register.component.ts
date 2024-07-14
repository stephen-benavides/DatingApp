import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  /* PROPERTIES */
  /* Tempalte form property
    - Property for the object to hold the template form values
    - Place holder for the model that the user is interacting with
    - needs to be initialized (empty) cant be null
  */
  //model :any = {}; 

  /* Input Property 
    - Input Property [Declarator] (Temporary) => not needed because we do not requiere to pass the users into this form, only for testing purposes 
    - Parent to Child Communication
    - More Information on home.component.html => Study Notes

    @Input() usersFomHomeController: any;
   */
  

  /* Output Property 
    - Child to Parent Communication
    - More Information on home.component.html => Study Notes
  */
 @Output() cancelRegister = new EventEmitter();

  /*
    Reactive form property - notes below 
  */
 //registerForm: FormGroup | undefined; //=> as we do not have access to it the moment we access the component
  registerForm: FormGroup = new FormGroup({});
  
  /*
    Date-picker property (STUDY NOTES: TYPE - DATE (1))
  */
  //Set the minimum date to display, to make sure the user is not a minor
  maxDate: Date = new Date();

  //Errors array
  registerFormValidationErrors: string[] | undefined;


  //ctor
  //Inject the service so you can use it in this register component
  //Injecting ToastrService to display messages to the user
  //Injecting FormBuilder Service - this will allow us to reduce the amount of code we write for Reactive Forms (NOTES OneNote - Reactive Forms)
  //Injecting router - to re route to the login page if it is a successful registration
  constructor(private accountService : AccountService, private toastr: ToastrService, private formBuilder: FormBuilder, private router: Router) {  
  }
  
  ngOnInit(): void {
    //Initializing the register form as soon as the component is invoked 
    this.initializeRegisterForm();
    //Set the max date for the date-picker.component.ts 
      //This will make it so it will only display date for people that are 18 years old or older
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  //Custom React Form Method -  to initialize the registerForm property as soon as this component loads 
  initializeRegisterForm(){
    //GOTO: OneNote (Reactive Forms)- Form Builder Service - 
      //Replaces the new FormGroup and the new FormControl (EXPLANATION (OneNote))
    this.registerForm = this.formBuilder.group({
      //FormGroup takes arguments of type FormControl
        //This form controls MUST have exactly the same name as their counterpart in the HTML code 'formControlName'. Otherise they WONT BE BOUND
      //FormControl takes arguments that we can use to validate the form objects

      /* Radio button - gender, 
        Setting the "default" value of the radio botton as 'male'. 

        
        Make sure it is written exactly the same as the value in the radio button on the html.
        We are doing it this way to avoid having to validate the radio button, as is tricky. Setting the default value is best
      */
      gender: ['male'],

      /*Input Text - Username
        place holder 'Hello', and is required. Can be empty
      */
      username: ['Hello Default Optional Text Input', Validators.required], 

      /* Input Text */
      knownAs: ['', Validators.required],

      /* Input Text */
      dateOfBirth: ['', Validators.required],

      /* Input Text */
      city: ['', Validators.required],

      /* Input Text */
      country: ['', Validators.required],

      /*Input Text - Password
        No place holder, and is requiered, with min length of 4 and max length of 8 
        => To run multiple validators at once, use an array of validator, this is accepted by the FormControl and it allows to run multiple validators at once
        You can also use patterns to create your own validations (Validators.pattern()) => which uses/is the same as REGEX
      */
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],

      /*Input Text - Password
        Custom method to validate (matchValues()), notes on the method itself
      */
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    /* Subcribing to observable to see if the password field is modified 
      1. The matchValues(matchTo: string) : ValidatorFn only check the current confirmationPassword, 
        but if the password changes, this is not picked up and the validation gives a false positive
      2. To avoid the issue, during the form registration we are navigation thorugh the formGroup -> register form to see if the 
      password is updated trough the .valueChanges() method. This method is an observable, we must subscribe to use it. 
      3. When subscribing, next we want to update the confirmPassword control, to update itself again to invoke the validators 
      4. In another words - any changes into the password field, will re-invoke the Validators of the confirmPassword field
      5. The below - control.Parent.get and this (this.registerForm.controls[]) are the SAME. In a formGroup we can access all the controls that belong to it
    */
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>{
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      }
    });
  }
  //Custom React Form Method - to create our own validations, in this case to compare the password and confirmation pasword in the react form 
  /* Validtors only accept values of type ValidatorFn (validator function), so we are retuning those types of values 
    - Validator functions (ValidatorFn) return a MAP of the validatons errors if any. If there are no errors then return null
   */
  matchValues(matchTo: string) : ValidatorFn{
    //return the control we are working with 
    // All react forms inherit from an AbstractControl. 
      //Thus to navigate accross the controller, we are using it to initialize a predicate function for our comparison 
    return (control: AbstractControl) => {
      //any thing that maps must also be returned
      //for this current control - bubble up to the parent(formGroup) and go down to the controller to match
      // In this ternary operation, if they match return null (success) otherwise return an anonymous boolean object indicating that it does not match
      /*STUDY NOTES - Typescript Initialization - you can initialize a property throgh its value, in this case we are initializing notMatching property as a boolean with 'true' */
      return (control.value === control.parent?.get(matchTo)?.value)? null :  {notMatching: true}; //the noMatching: true is used to store "the custom error" "noMatching" and use it if  needed (register.component.html)  
    }
  }



  /*DEBUG - Register method for debug purposes, */
  //to print the objects of the registerForm for the react form into the console prior to subscribing to submit the service
  //public register(){
  //  console.log(this.registerForm.value);
  //}

  // //When user hits register for Template forms
  // //public void Register()
  // public register(){
  //   // console.log(this.model); //DEBUG
  //   //us the register service to register the user that is passed to the model (observable)
  //   this.accountService.register(this.model).subscribe({
  //     //next:() had 'response' in it but as console.log has been commented out, we do not need it anymore, so empty is fine
  //     next:() =>{
  //       /* Console Log DEBUG => explanation on usage for RxJS in (account.services.ts => register() return region)
  //       console.log(response);
  //        */
        
  //       //close register form after completion
  //       this.cancel();

  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.toastr.error(error.error);
      
  //     }
  //   })
  // }

  //Register for REACTIVE FORM
  public register() {
    //console.log(this.registerForm.value); //=> Check all the values from the reactive register form 

    //Pass the date from the registerForm to get the date only using our own method
    let dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    //Change the date in the register form by accessing all its objects (Array Spreading => Notes Below)
    let registerFormValues = { ...this.registerForm.value, dateOfBirth: dob };
    //console.log(registerFormValues); //=> CHeck if the DOB is chaging the value from the register form as expected

    //us the register service to register the user that is passed to the model (observable)
    this.accountService.register(registerFormValues).subscribe({
      next: () => {
        //If it is successful, the reroute to the login page (as when the user hits the login button an is successful)
        this.router.navigateByUrl('/members');      
      },
      error: (error) => {
        //The errors are now handled through the _interceptors/error.interceptor.ts 
        //console.log(error);
        //this.toastr.error(error.error);

        //In case there are errors populate an array, to display a general message to the client when they hit the register button
        //This is only a precation, in case the registration its bypassed by the user
        this.registerFormValidationErrors = error;
        //console.log(this.registerFormValidationErrors)

      }
    })
  }

  //Method to convert the datetime to only date, to keep consistency in the server 
  private getDateOnly(dob: string | undefined) {
    //If there is no DOB, then return 
    if (!dob)
      return; 

    //Convert from string to DOB object 
    let theDob = new Date(dob);
    //Return the date only, which will take into consideration the local time of the server, to avoid weird dates based on where in the world the user is 
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset()))
      .toISOString().slice(0, 10);
  }


  
  //To cancel registration page and go back to the parent page
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



/*
STUDY NOTES - REACTIVE FORMS 
  1. Reactive forms are the go to in angular development. It allows the control of all aspectes of the form from the components(component.ts).
    Up to this point we were using Template Forms. 
      1. Template forms uses the 2 way binding for communications [(NgModel)], it stores the elements into a signle variable in the component which is then 
      used to submit the form (model :any = {}; )
      2. Template forms required FormsModule in app,module.ts
  
  3. To use reactive forms you must: 
    1. Add the module ReactiveFormsModule into (app.module.ts))
    2. Create a variable of type FormGroup => registerForm: FormGroup
      1. The objects inside a form group are of type FormControl 
      2. This FormControls are used to set the variables that are used by the client 
      3. It is easier to test everything through the component.ts instead of relying solely on the .html for the valiadtions 
    3. Initialize the FormGroup by creating FormControls inside 
      1. We did it here using the initializeRegisterForm method (custom method)
      2. This formControls variables are used to manipulate the objects in the form directly from the component.
        this way we avoid having to do validation in the .html page 
      3. This variables in this example are used for the username, password, and password confirmation 
  
    4. Use the form control objects name in the client site (component.html) to invoke the form 
      1. Similar on how the template form uses <form #registerForm="ngForm" to indicate the template form as a registerForm, 
      we are also doing something similar for reactive forms 
      2. We replace the #registerForm = "ngForm" with a [formGroup] tag => [formGroup]="registerForm"  
      3. If you get the following error in the client: Type 'FormGroup<any>' | undefined' is not assignable to type 'FormGroup<any>'....
        1. Then it means that the property in this apge (component.ts) has not been initialize property 
        2. For instance we might initialize as => registerForm: FormGroup | undefined; as this property is initialize later, 
        but for reactive components you must initialize to an empty object.
        registerForm: FormGroup = new FormGroup({}); => FormGroup must have 1 argument. Thus, the empty object

    5. Set the formControl variables in the FormGroup in the client site to map with the objects in this registerForm
      1. We need to remove the 2way binding [(ngModel)] as that is used by the template forms 
      2. We can keep the class, that is universal and bootsrap is using them 
        1. Same with the type
      3. No need for the "name" as that is used to bind the template form to the "model" variable => model :any = {}; 
        [(ngModel)]="model.username" IS REPLACED BY: formControlName = "username" //=> From template form to Reactive Form
      
    6. We can use the variables in the component (ts) to manipulate the behavior of the form. 
      1. In template forms any validations must be done at the page level (html/js)
      2. In Reactive forms this elements become objects to be used in the component level (ts)

    7. FormControl Validators 
      1. Form Control takes arguments that we can use to validate the objects 
      1. Such as validating that a field is requiered and whatnot 
      2. We can also use regular expressions, in order to access this validations in the FormControl we use the Validators class 
      3. It accepts Validators and array of validators 

    8. Checking the status of the formGroup
      1. We can see the status of the form group by accessing the property status 
      2. Currently in the HTML part of the component: 
        <p>Form Value: {{registerForm.value | json}}</p>
        <p>Form Status: {{registerForm.status | json}}</p>


    9. Creating our own validations (matchValues())
      1. Create a method that return ValidatorFn (Validator Function)
        1. It returns a map - thus return again 
      2. add it as a regular validator 

    10. Subscribing to check if the value of a field in the form has changed
      1. In case we need extra security 
      2. We can let the component know there has been changes in the form and to perform certain actions 
      3. This is done here when the form is initialized 
        1. this.registerForm.controls['password'].valueChanges.subscribe({
          1. valueChanges 
				    1. Allow us to subscribe to see if there are any changes in the field 
			    2. updateValueAndValidity 
            1. Allow us to indicate that we want to recalculate the values in the control field. (4)

    Array Spreading (...)
      1. The purpose is to create a new array with all the objects inside the array we are spreading (...)
      2. We have use it in the past (member.service.ts => updateMember(member: Member){})
      3. In this case we are using it to update the element inside the registerForm with our new dateOfBirth

    
 */