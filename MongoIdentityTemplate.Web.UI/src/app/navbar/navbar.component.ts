import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  public isAuthenticated: boolean = false;
  public isAdmin: boolean | undefined = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.getAuthenticationStatusListener().subscribe({
      next: status => {
        this.isAuthenticated = status.isAuthenticated;
        this.isAdmin = status.roles.includes('admin');
      }
    });

    this.authenticationService.autoLogin();
  }

  public logout(): void {
    this.authenticationService.logout();
  }
}
