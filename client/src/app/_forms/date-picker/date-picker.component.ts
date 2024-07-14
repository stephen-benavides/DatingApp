import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements ControlValueAccessor  {
  //Label for the calendar
  @Input() label = '';
  //As this is only for calendar types, we are defining it as such 
  @Input() maxDate: Date | undefined;
  //GOTO notes below 
  bsConfig: Partial<BsDatepickerConfig> | undefined;

  constructor(@Self() public ngControl: NgControl) {
    //GOTO: text-input.component.ts 
    this.ngControl.valueAccessor = this;
    //Initializing the configurations for our datepicker
    this.bsConfig = {
      containerClass: 'theme-red', //Color of the calendar
      dateInputFormat: 'DD MMMM YYYY' //How th date shall be displayed
    }
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  //Same getter as in text-input.component.ts to cast the object of the form to formControl
  //So it can be used in our template, otherwise it will return an error. 
  get control(): FormControl{
    return this.ngControl.control as FormControl
  }
  
}

/*
  STUDY NOTES: TYPE - DATE (2)
    1. Component to have the same user experience regardless of the browser.
    2. Component comes ffrom angular bootstrap > datepicker 
    3. Follow the steps of the datepicke api 
      1. https://valor-software.com/ngx-bootstrap/#/components/datepicker?tab=api
      2. In the NgModule (app-routing.module.ts) you need to add the import specified in the documentation (BsDatepickerModule.forRoot(),)
      3. In this project, any external components are loaded in shared.module.ts 

    4. Implementing ControlValueAccessor
      1. We are doing this because we are manipulating values in the DOM, and we need the methods that 
      come in with the implementation in order to do so. 
      2. More notes on this type of implementation on 'text-input.component.ts'


    5. bsConfig: Partial<BsDatepickerConfig> | undefined;
      1. This is needed to set configuration on the datepicker
      2. This property was defined in the angular documentation for the datepicker 
      3. 'Partial' means that any properties inside the class that is defined in "<>" is optional 
        1. This means we can define 0 or many of the properties that belong to the BsDatepickerConfig. 
 */
