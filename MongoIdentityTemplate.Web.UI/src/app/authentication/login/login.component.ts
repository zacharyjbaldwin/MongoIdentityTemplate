import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private redirectTo: string | undefined;
  private subs = new Subscription();

  public errorMessage: string | undefined;
  public submitting: boolean = false;

  public form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: params => {
        this.redirectTo = params['redirectTo'];
      }
    });

    this.subs.add(this.authenticationService.getAuthenticationErrorListener().subscribe({
      next: error => {
        this.errorMessage = error.message;
        this.submitting = false;
      }
    }));
  }

  public submit(): void {
    this.submitting = true;
    this.authenticationService.login({ email: this.form.value.email, password: this.form.value.password }, this.redirectTo);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
