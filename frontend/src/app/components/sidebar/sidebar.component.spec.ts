import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SidebarComponent}        from './sidebar.component';
import {ThemeService}            from "../../services/theme.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SidebarComponent,
                HttpClientTestingModule
            ],
            providers: [
                ThemeService
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
