import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent}              from './app.component';
import {ThemeService} from "./services/theme.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoginComponent} from "./views/login/login.component";
import {Theme}                     from "./models/theme";
import {RequestService}            from "./services/request.service";

const theme: Theme = new Theme();
theme.name = 'Catppuccin Mocha';
theme.className = 'catppuccin_mocha';
theme.style = '--background-0: #181825;--background-1: #1e1e2e;--background-2: #313244;--background-3: #45475a;--background-4: #585b70;--foreground-0: #cdd6f4;--foreground-1: #bac2de;--foreground-2: #a6adc8;--foreground-3: #9399b2;--foreground-4: #7f849c;--red: #f38ba8;--yellow: #f9e2af;--orange: #fab387;--magenta: #eba0ac;--violet: #b4befe;--blue: #89dceb;--cyan: #94e2d5;--green: #a6e3a1;--border-radius: 5px;--border: 1px solid var(--foreground-0);--border-inverse: 1px solid var(--background-0);--sidebar-left-padding: 1rem;--sidebar-top-padding: 1rem;--sidebar-bottom-padding: 1rem;--sidebar-right-padding: 1rem;--content-top-padding: 1rem;--content-right-padding: 1rem;--content-bottom-padding: 1rem;'

describe('AppComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let themeService: ThemeService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppComponent,
                HttpClientTestingModule
            ],
            providers: [
                ThemeService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        themeService = TestBed.inject(ThemeService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
