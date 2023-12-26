import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/authentication/loginRequest';
import { Observable, Subject } from 'rxjs';
import { AuthenticationResult } from '../models/authentication/authenticationResult';
import { environment } from 'src/environments/environment.development';
import { LocalAuthenticationData } from '../models/authentication/localAuthenticationData';
import { Router } from '@angular/router';
import { AuthenticationStatus } from '../models/authentication/authenticationStatus';
import { AuthenticationError } from '../models/authentication/authenticationError';
import { RegisterRequest } from '../models/authentication/registerRequest';
import { AuthenticationExceptionCode } from '../models/authentication/authenticationExceptionCode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authenticationError = new Subject<AuthenticationError>();
  private authenticationStatus = new Subject<AuthenticationStatus>();
  private isAuthenticated: boolean = false;
  private localStorageKey: string = 'user';
  private logoutTimer: any;
  private user: LocalAuthenticationData | undefined;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getUser(): LocalAuthenticationData | undefined {
    return this.user;
  }

  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  public getAuthenticationErrorListener(): Observable<AuthenticationError> {
    return this.authenticationError;
  }

  public getAuthenticationStatusListener(): Observable<AuthenticationStatus> {
    return this.authenticationStatus;
  }

  public autoLogin(): void {
    const localAuthenticationData = this.getLocalAuthenticationData();
    if (localAuthenticationData != null) {
      const now = new Date();
      const expiresOn = new Date(localAuthenticationData.expiresOn);
      if (expiresOn >= now) {
        this.user = localAuthenticationData;
        this.setAutoLogoutTimer((expiresOn.getTime() - now.getTime()) / 1000);
        this.isAuthenticated = true;
        this.authenticationStatus.next({ isAuthenticated: true, roles: this.user.roles });
        console.log('AutoLogin succeeded.');
      } else {
        this.clearLocalAuthenticationData();
      }
    }
  }

  public login(request: LoginRequest, redirectTo?: string): void {
    this.http.post<AuthenticationResult>(`${environment.apiUrl}/authentication/login`, request).subscribe({
      next: result => {

        this.user = {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          roles: result.roles,
          token: result.token,
          gender: result.gender,
          expiresOn: new Date(new Date().getTime() + (result.expiresIn * 1000)),
        };

        this.setLocalAuthenticationData(this.user);
        this.setAutoLogoutTimer(result.expiresIn);
        this.isAuthenticated = true;
        this.authenticationStatus.next({ isAuthenticated: true, roles: this.user.roles });

        this.router.navigateByUrl(redirectTo ? redirectTo : '/');
      },
      error: error => {
        this.authenticationError.next({ message: 'The provided email or password was invalid.' });
      }
    });
  }

  public register(request: RegisterRequest, redirectTo?: string): void {
    this.http.post<AuthenticationResult>(`${environment.apiUrl}/authentication/register`, request).subscribe({
      next: result => {
        this.login({ email: result.email, password: request.password });
        this.router.navigateByUrl(redirectTo ? redirectTo : '/');
      },
      error: error => {
        let errorMessage: string;
        switch (error.error.code as AuthenticationExceptionCode) {
          case AuthenticationExceptionCode.DuplicateEmail:
            errorMessage = error.error.message;
            break;
          case AuthenticationExceptionCode.GenericError:
          default:
            errorMessage = 'An error occurred while regsitering.'
        }
        this.authenticationError.next({ message: errorMessage });
      }
    });
  }

  public logout(redirectTo?: string): void {
    this.user = undefined;
    this.isAuthenticated = false;
    this.authenticationStatus.next({ isAuthenticated: false, roles: [] });
    this.clearLocalAuthenticationData();
    clearInterval(this.logoutTimer);
    this.router.navigateByUrl(redirectTo ? redirectTo : '/');
  }

  private setAutoLogoutTimer(seconds: number): void {
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, seconds * 1000);
  }

  private clearLocalAuthenticationData(): void {
    localStorage.clear();
  }

  private getLocalAuthenticationData(): LocalAuthenticationData | null {
    var data = localStorage.getItem(this.localStorageKey);
    return data == null ? null : JSON.parse(data);
  }

  private setLocalAuthenticationData(data: LocalAuthenticationData): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }
}
