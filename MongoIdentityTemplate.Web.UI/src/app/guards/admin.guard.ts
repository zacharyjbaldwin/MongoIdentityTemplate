import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }
  
  canActivate(): boolean {
    let user = this.authenticationService.getUser();
    
    if (user == null || !user.roles.length) this.router.navigateByUrl('login?redirectTo=admin');
    if (user != null && !user.roles.includes('admin')) this.router.navigateByUrl('/');
    if (user != null && user.roles.includes('admin')) return true;

    return false;
  }
}
