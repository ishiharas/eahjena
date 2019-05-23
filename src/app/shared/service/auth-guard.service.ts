import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Router } from '@angular/router';
import { getString, getBoolean } from 'tns-core-modules/application-settings/application-settings';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() {

    if (!getBoolean("selection_finished")) {
            this.router.navigate(['/intro']);
            return false;
        }

    return true;
  }

  constructor(private router: Router) { }
}