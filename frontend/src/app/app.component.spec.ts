import {TestBed}                  from '@angular/core/testing';
import {AppComponent}                                                             from './app.component';
import {HttpClientTestingModule, HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {ThemeService}                                                             from "./services/theme.service";
import {AuthenticationService}    from "./services/authentication.service";
import {DropdownService}          from "./services/dropdown.service";
import {RouterModule}             from "@angular/router";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import {provideHttpClient} from "@angular/common/http";

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppComponent,
                RouterModule.forRoot([]),
            ],
            providers: [
                ThemeService,
                AuthenticationService,
                DropdownService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
