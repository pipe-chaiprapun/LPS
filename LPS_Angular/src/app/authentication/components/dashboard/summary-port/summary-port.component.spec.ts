import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPortComponent } from './summary-port.component';

describe('SummaryPortComponent', () => {
  let component: SummaryPortComponent;
  let fixture: ComponentFixture<SummaryPortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
