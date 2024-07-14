import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {
  //Label of the form i.e. username 
  @Input() label = '';
  //Type of user input, we usually use text, but we can override if that is not the case i.e. = label (password) //=> type (password)
  @Input() type = 'text';

  //Notes below
  constructor(@Self() public ngControl: NgControl) {
    //Notes bellow
    this.ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

    // Optional(?) not needed 
    // setDisabledState?(isDisabled: boolean): void {
    //   throw new Error('Method not implemented.');
    //}


    /*
    CUSTOM:
      1. GET is a keyword in angular that work the same as in C#(getter/setter)
      2. In this case we are using this getter to cast the ngControl.control as FormControl
        1. Which is required by [formControl] in text-input.component.html
    */
    get control(): FormControl{
      return this.ngControl.control as FormControl
    }
 
  }



/*
  *REUSABLE CODE AS IS*

  STUDY NOTES - Creating Resuable Component for HTML Validations (2)
  1. Component used specifically for the purpose of handeling all validations in the HTML pages 
  2. This was done for the purpose of handleing reactive forms validations 
  3. Usually components implement the OnInit. But, for this validation component we are implementing the ControlValueAccessor 
    1. ControlValueAccessor implenets an interface that acs as a bridge between the Angular Forms and the DOM. 
      1. This is exactly what we need, a breach to handle the validation in the form 
      2. When implementing the ControlValueAccessor, we also need to implement other methods that are required by the implementation 
      3. We dont really need to write any implementation code, we could just leave them blank, by default it is just going to pass through this methods
      and if we dont write anything in them, then the behavior will be the defaulted one. 

  4. Injecting a decorator @Self - NgControl 
    1. It is also considered an input parameter, like @Input() label and @Input() type. Only that in the ctor it will be initialized first
    2. t come from angular core 
    3. and we are using it to get the controllers from the parent object we want to use the form from. 
    We pass for instanec the parameters to create the username input through react forms, in react forms the form itself is written in the code behind (.ts). 
    The .html is used to display the objects that are created at run time. Thus we can use the @Self to make sure only the information for 'username'
    is displayed and not the information for 'password' 
    
    NgControl - 
      1. It is the parent class of the Form Control, which we use to manipulate the fields in the Reactive Form (register.component.html / ts)

    ---
      We are using the @Self() because the way angular works. ANgular by default re uses the data, it checks in the cached if the 
      component or service has been called already through the constructor. 
      In this case, we want to override this behavior from angular, as we do not want this component to store and use data that is comming in from another page.
      Thus, we use Self() to make sure a new instance is created every time this component is invoked.
      This makes sure that the NgComponent that will interact with this form, will ALWAYS be the last one used. and not any previously stored state. 


  this.ngControl.valueAccessor = this;
      We are setting any ngControl (valueAccessor) that implements this component to this 'TextInputComponent'.
      which will allow us to use the methods below (writeValue, registerOnchange, etc..) to interact with the DOM
      Such as: any time the value in the register component (username) has been changed, it will go trough TextInputComponent, 
      and this will affect its behavior. such as 'check if it has been manipulated and display error message if it does not meet criteria'
      FROM register.component.html //=>[class.is-invalid]="registerForm.get('username')?.errors && registerForm.get('username')?.touched"
*/