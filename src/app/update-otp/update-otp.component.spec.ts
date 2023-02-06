import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOtpComponent } from './update-otp.component';

describe('UpdateOtpComponent', () => {
  let component: UpdateOtpComponent;
  let fixture: ComponentFixture<UpdateOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
