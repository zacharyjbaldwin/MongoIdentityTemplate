import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Gender } from 'src/app/models/common/gender';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  private redirectTo: string | undefined;
  private subs = new Subscription();

  public errorMessage: string | undefined;
  public gender: typeof Gender = Gender;
  public submitting: boolean = false;

  public form: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
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
    this.authenticationService.register({
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      gender: +this.form.value.gender,
      email: this.form.value.email,
      password: this.form.value.password,
    }, this.redirectTo);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
