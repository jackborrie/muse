import {TestBed} from '@angular/core/testing';

import {ThemeService}   from './theme.service';
import {RequestService} from "./request.service";
import createSpyObj = jasmine.createSpyObj;
import {Theme}          from "../models/theme";
import {FilteredData}   from "../models/filtered-data";
import {of}             from "rxjs";

const theme: Theme = new Theme();
theme.name = 'Catppuccin Mocha';
theme.className = 'catppuccin_mocha';
theme.style = '--background-0: #181825;--background-1: #1e1e2e;--background-2: #313244;--background-3: #45475a;--background-4: #585b70;--foreground-0: #cdd6f4;--foreground-1: #bac2de;--foreground-2: #a6adc8;--foreground-3: #9399b2;--foreground-4: #7f849c;--red: #f38ba8;--yellow: #f9e2af;--orange: #fab387;--magenta: #eba0ac;--violet: #b4befe;--blue: #89dceb;--cyan: #94e2d5;--green: #a6e3a1;--border-radius: 5px;--border: 1px solid var(--foreground-0);--border-inverse: 1px solid var(--background-0);--sidebar-left-padding: 1rem;--sidebar-top-padding: 1rem;--sidebar-bottom-padding: 1rem;--sidebar-right-padding: 1rem;--content-top-padding: 1rem;--content-right-padding: 1rem;--content-bottom-padding: 1rem;'

const data: FilteredData<Theme> = {
    data: [
        theme
    ],
    totalPages: 1
}

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        const requestSpy = createSpyObj('RequestService', ['getAll']);

        requestSpy.getAll.and.returnValue(of (data));

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: RequestService,
                    useValue: requestSpy
                }
            ]
        });
        service = TestBed.inject(ThemeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it ('should load all themes', () => {
        service.fetchAllThemes()
        expect(service.getAllThemes()).toEqual(data.data);
    });

    it ('should set the theme service theme correctly', () => {
        service.setTheme(theme);
        expect(localStorage.getItem('theme')).toBeTruthy();
    })

    it ('should pass the theme around correctly', (done) => {
        service.$onThemeChanged.subscribe(result => {
            expect(result).toEqual(theme);
            done();
        });
        service.setTheme(theme);
    });

    it ('should load the theme from local storage', () => {
        const currentTheme = new Theme();

        currentTheme.serialise(JSON.parse(localStorage.getItem('theme') ?? ''));

        expect(currentTheme).toEqual(theme)
    })
});
