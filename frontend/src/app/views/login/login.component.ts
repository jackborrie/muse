import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID}         from '@angular/core';
import {MuseInputDirective}                                        from "../../directives/muse-input.directive";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MuseButtonDirective}                                       from "../../directives/muse-button.directive";
import {User}                                                      from "../../models/user";
import {AuthenticationService} from "../../services/authentication.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        MuseInputDirective,
        FormsModule,
        ReactiveFormsModule,
        MuseButtonDirective
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{

    protected loginFormGroup = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    })

    private _subscription: Subscription = new Subscription();
    private _attemptingLogin = false;

    public constructor (
        private _formBuilder: FormBuilder,
        private _authService: AuthenticationService,
        private _router: Router
    ) {

    }

    protected handleLogin () {
        this.loginFormGroup.markAsTouched();

        if (!this.loginFormGroup.valid) {
            return;
        }

        var user = new User();
        user.password = this.loginFormGroup.get('password')?.value || null;
        user.email = this.loginFormGroup.get('email')?.value || null;
        user.username = user.email;

        this._attemptingLogin = true;
        this._authService.login(user);
    }

    ngOnInit () {
        const authChange = this._authService.$onIsLoggedInChanged
            .subscribe(result => {
                if (!this._attemptingLogin) {
                    return;
                }

                if (!result) {
                    return;
                }

                this._router.navigate(['/']);
            });
    }
    ngOnDestroy () {

    }
}
