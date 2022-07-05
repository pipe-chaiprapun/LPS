import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdReportComponent } from './od-report.component';

describe('OdReportComponent', () => {
  let component: OdReportComponent;
  let fixture: ComponentFixture<OdReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
