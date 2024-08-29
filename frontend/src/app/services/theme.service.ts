import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {BehaviorSubject, Subject} from "rxjs";
import {Theme} from "../models/theme";
import {FilteredData} from "../models/filtered-data";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private _currentTheme: Theme | null = null;
    public $onThemeChanged: Subject<Theme> = new Subject();

    private _allThemes: FilteredData<Theme> | null = null;
    public $onAllThemesChange: Subject<FilteredData<Theme> | null> = new BehaviorSubject<FilteredData<Theme> | null>(null);

    constructor(
        private _request: RequestService
    ) {
    }

    public fetchAllThemes () {
        this._request.getAll<Theme>('api/themes', Theme, null)
            .subscribe((themes: FilteredData<Theme> | null) => {
                this._allThemes = themes;
                this.$onAllThemesChange.next(this._allThemes);
            })
    }

    public getAllThemes (): Theme[] {
        return this._allThemes ? this._allThemes.data : [];
    }

    public getThemeById (id: string){
        this._request.get('api/themes/' + id, Theme, null)
            .subscribe((theme: Theme | null) => {
                if (theme == null) {
                    return;
                }
                this._currentTheme = theme;
                this.$onThemeChanged.next(this._currentTheme);
            });
    }

    private getDefaultTheme () {
        this._request.get('api/themes/default', Theme, null)
            .subscribe((theme: Theme | null) => {
                if (theme == null) {
                    return;
                }

                this._currentTheme = theme;
                this.$onThemeChanged.next(this._currentTheme);
            })
    }

    public setTheme (theme: Theme) {
        localStorage.setItem('theme', JSON.stringify(theme));
        this._currentTheme = theme;
        this.$onThemeChanged.next(this._currentTheme);
    }

    public initialThemeLoad () {
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme == null) {
            console.log('No theme found, using default.')
            this.getDefaultTheme();
            return;
        }

        let theme: Theme = new Theme();
        try {
            theme.serialise(JSON.parse(currentTheme));
        } catch {
            console.error('Previous theme wasn\'t able to load, might be corrupt.');
            localStorage.removeItem('theme');
            return;
        }


        this._currentTheme = theme;
        this.$onThemeChanged.next(this._currentTheme);
    }
}
