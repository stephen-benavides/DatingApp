import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //Module Use for HTTP request transactions 
    //Need to import from @angular/common/http to use this module 
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot() 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



/*
  Study Notes 
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
        1. To use ng(angular) form functionality 
        2. #loginForm="ngForm" => nav.component.html
        3. <Input name="">
      5. BsDropDownModule
        1. To use angular bootstrap drop down menus 
        2. From: https://valor-software.com/ngx-bootstrap/#/components/dropdowns?tab=api
*/