import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';

const routes: Routes = [
  /*
    Set the path of the routes - GOTO => STUDY NOTES
    
   */
  //Empty route ("" OR "/") that routes back to the home page => https://localhost:4200/
  {path: '', component: HomeComponent},
  //Path protected by authGuard (custom => GOTO: _guards/auth.guard for more info AND STUDY NOTES BELOW)
  {path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [authGuard],
      children: [
          //To Display different members =>https://localhost:4200/members
          //Passing custom authGuard (/app/_guards)
        {path: 'members', component: MemberListComponent, canActivate: [authGuard]},
        //To display details of the members '/:' - is a route parameter => https://localhost:4200/members/2
        {path: 'members/:id', component: MemberDetailComponent},
        //To display messages => https://localhost:4200/messages
        {path: 'messages', component: MessagesComponent},
        //To display lists => => https://localhost:4200/lists
        {path: 'lists', component: ListsComponent},
      ]
  },
  //Path to our error component to test errors
  {path: 'errors', component: TestErrorComponent},
  //path to our server and not-found errors 
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'not-found', component: NotFoundComponent},


  //Wild Card Route: 
    //If invalid route, redirect to the home component => https://localhost:4200/afsdfsdf
  {path: "**", component: HomeComponent, pathMatch: "full"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



/*
  STUDY NOTES - Routing in Angular 

  1. This is created when selecting 'Y' during project creation when prompted with rooting
    1. You can also do so manually by creating a new component: 
      1. ng generate module [module-name] --routing
  2. Routing is use to move from URL to another URL, without having to click on multiple buttons to navigate a page 
  3. The same as with a normal website 
    i.e. http://someSite.com => http://someSite.com/anotherLink 
  4. Use routing to move between different components 
  5. Import in app.module.ts => AppRoutingModule

  4. Setting Up Routing in Angular 
    1.  In const routes: Route = [];
      1. Array of routs that is passed in the @NgModel 
      2. It takes objects, so any new objects must be in {}
      3. Set the different components that the application can route to 
      4. Set the path of the routes: 
        1. The routes are in order of execution
        2. Whatever matches is going to try to load the component 
        3. It should go from the most likely to happen to the least likely 
        4. Best Practice is to have a wild card (**)route that will executed when everything else fails 
          1. To avoid things like //doesNotExist.com 
          2. Represents anything not in the list 
          3. Best practice is to set a path match: either full or prefix 
            1. prefix: 
              1. needs to match most of the elements in the URL
              2. It is used for instance if one of the parameters is incorrect 
            2. full: 
              1. Matches against the entire URL 
              2. In this case if the URL is nonses then it will go to the routed component, in this example home 
              3. {path: "**", component: HomeComponent, pathMatch: "full"}
        
  5. Activating the Route 
    1. In app.component.html (root component) 
    2. Add <router-outlet></router-outlet> 



  

AUTH GUARD 
  1. You can use Auth Guard to "hide" data from the user, user interface feature 
  2. More information on ./app/_guards/authGuard => Study Notes 
  3. Proecting a single route example:
    1. {path: 'members', component: MemberListComponent, canActivate: [authGuard]},
  4. To protect multiple routes, you need to create a dummy route 
    1. {path: '',
        runGuardsAndResolvers: 'always', --Indicate if you want it to run every time 
        canActivate: [authGuard], --Custom Guard 
        children: [
            <!-- ALL THE ROUTES YOU WANT TO PROTECT INSIDE --> 
          ]
        }
    2. You can remove the single canActivate, as if you set the dummy route, then it will get protected by default 
        1. {path: 'members', component: MemberListComponent},

*/