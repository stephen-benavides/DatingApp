import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_service/account.service';
import { ToastrService} from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  // Initializing Services 
  const accountSerice = inject(AccountService);
  const toastr = inject(ToastrService);

  //return true if we have a current user 
  return accountSerice.currentUser$.pipe(
    map((user) => {
      //If there is an user active, then show the data, else do not 
      if(user) return true; 

      else{
        toastr.error("you shall not pass.")
        return false; 
      }

    })
  );
};


/*
  STUDY NOTES 
  1. Guards are used with the following command in the CLI 
    1. ng g g --skip-tests --dry-run 
    2. You can also use the --flat to avoid creating new folders if you wish to do so 
  2. Guards are used to generate a level of "protection" in your code. 
    1. It is impossible to fully protect angular code, as it is translated into JS
    2. Anything written in JS can be viewed by others
    3. Any real protection is done by the server only
  3. Guards are not classes/components, you cant inject the services to it, as there is not a constructor. 
    But, you can set variables to intialize services by using the "Inject()" method which you can use in your application 
      1. const accountSerice = inject(AccountService);
      2. Allow us to use the AccountService methods in our guard 
  4. return true by default will let the application know that they 
    can move forward and display the information hidden by the guard, false indicates that they cant see it. 
  5. Adding this guard to the members route => app-routing.module.ts 
*/