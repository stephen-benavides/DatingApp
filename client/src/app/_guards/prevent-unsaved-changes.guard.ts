import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {

  //Check if the form is dirty(changes have not been saved) to let the user now using JS alerts 
  if(component.editForm?.dirty)
    return confirm("Are you sure you want to continue? Any unsaved changes will be lost");
  //else return true, meaning no unsaved changes and the user can move on to the next page
  return true;
};


/* STUDY NOTES - DEACTIVATE GUARD
  1. Created by:
    ng g g _guards/prevent-unsaved-changes --skip-tests 
      - select: can deactivate guard. 
  2. Use so when the user is in a route that is being guarded by a guard such as the member-edit by the auth,guard
    Then, a message is provided back to the user to check if they want to exit the current route. 
  3. For our purposes to check if the current component can leave to another component, then we can remove the other input paramters 
    - currentRoute, currentState, nextState
  4. Make sure to change the deactivate type <>, to the type you want to use 
    1. MemberEditComponent is the route we want to deactivate from the current guard 
  5. Make to sure to add the new "guard" in the app-routing.module.ts 
    1. In this case it will be added to the memberEdit component in the app-routing 
    2. {path: 'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard]}, 
  6. You can change the CSS of this check box, as its created by JS 
  
*/