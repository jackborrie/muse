import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID}         from '@angular/core';
import {MuseInputDirective}                                        from "../../directives/muse-input.directive";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MuseButtonDirective}                                       from "../../directives/muse-button.directive";
import {User}                                                      from "../../models/user";
import {AuthenticationService} from "../../services/authentication.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        MuseInputDirective,
        FormsModule,
        ReactiveFormsModule,
        MuseButtonDirective,
        NgIf
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{

    protected loginFormGroup = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        username: ['']
    })

    protected currentScreen: 'login' | 'register' = 'login';

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

        let user = new User();
        user.password = this.loginFormGroup.get('password')?.value || null;
        user.email = this.loginFormGroup.get('email')?.value || null;

        if (this.currentScreen == 'login') {
            user.username = user.email;
        } else {
            user.username = this.loginFormGroup.get('username')?.value || null;
        }

        this._attemptingLogin = true;

        if (this.currentScreen == 'login') {
            this._authService.login(user);
        } else {
            this._authService.register(user);
        }
    }

    protected switchScreen () {
        if (this.currentScreen === 'register') {
            this.currentScreen = 'login';

            this.loginFormGroup.get('username')?.addValidators([Validators.required, Validators.minLength(5), Validators.maxLength(20)])
        } else {
            this.currentScreen = 'register';

            this.loginFormGroup.get('username')?.removeValidators([Validators.required, Validators.minLength(5), Validators.maxLength(20)])
        }
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

        this._subscription.add(authChange);
    }
    ngOnDestroy () {
        this._subscription.unsubscribe()
    }
}
