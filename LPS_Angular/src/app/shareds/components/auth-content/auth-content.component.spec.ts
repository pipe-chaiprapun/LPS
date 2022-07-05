import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthContentComponent } from './auth-content.component';
import { AuthNavbarComponent } from '../auth-navbar/auth-navbar.component';
import { AuthSidebarComponent } from '../auth-sidebar/auth-sidebar.component';
import { Directive, Input, HostListener } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthContentComponent', () => {
  let component: AuthContentComponent;
  let fixture: ComponentFixture<AuthContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ AuthContentComponent, AuthNavbarComponent, AuthSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any;

  @HostListener('click') onClick(): void {
    this.navigatedTo = this.linkParams;
  }
}
