import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerInfoComponent } from './customer-info.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AuthContentComponent } from 'src/app/shareds/components/auth-content/auth-content.component';
import { AccountServiceComponent } from './account-service/account-service.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AuthNavbarComponent } from 'src/app/shareds/components/auth-navbar/auth-navbar.component';
import { AuthSidebarComponent } from 'src/app/shareds/components/auth-sidebar/auth-sidebar.component';
import { Directive, Input, HostListener } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CustomerInfoComponent', () => {
  let component: CustomerInfoComponent;
  let fixture: ComponentFixture<CustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PaginationModule.forRoot(),
        CarouselModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        CustomerInfoComponent,
        AuthContentComponent,
        AccountServiceComponent,
        PersonalInfoComponent,
        PortfolioComponent,
        AuthNavbarComponent,
        AuthSidebarComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInfoComponent);
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
