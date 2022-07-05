import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PersonalInfoComponent } from './personal-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Directive, Input, HostListener } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CarouselModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [PersonalInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoComponent);
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
