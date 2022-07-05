import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { AuthContentComponent } from 'src/app/shareds/components/auth-content/auth-content.component';
import { AuthNavbarComponent } from 'src/app/shareds/components/auth-navbar/auth-navbar.component';
import { AuthSidebarComponent } from 'src/app/shareds/components/auth-sidebar/auth-sidebar.component';
import { Directive, Input, HostListener } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        ReportComponent,
        AuthContentComponent,
        AuthContentComponent,
        AuthNavbarComponent,
        AuthSidebarComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
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
