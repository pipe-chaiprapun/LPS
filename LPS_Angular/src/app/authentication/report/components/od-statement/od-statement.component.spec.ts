import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdStatementComponent } from './od-statement.component';

describe('OdStatementComponent', () => {
  let component: OdStatementComponent;
  let fixture: ComponentFixture<OdStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
