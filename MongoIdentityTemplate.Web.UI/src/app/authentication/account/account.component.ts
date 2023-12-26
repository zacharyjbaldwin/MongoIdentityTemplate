import { Component, OnInit } from '@angular/core';
import { LocalAuthenticationData } from 'src/app/models/authentication/localAuthenticationData';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  public user: LocalAuthenticationData | undefined;

  constructor(authenticationService: AuthenticationService) {
    this.user = authenticationService.getUser();
  }
}
