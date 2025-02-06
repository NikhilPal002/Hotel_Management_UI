import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPaymentReportComponent } from './staff-payment-report.component';

describe('StaffPaymentReportComponent', () => {
  let component: StaffPaymentReportComponent;
  let fixture: ComponentFixture<StaffPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPaymentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
