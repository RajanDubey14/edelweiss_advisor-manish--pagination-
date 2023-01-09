import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycdocumentComponent } from './kycdocument.component';

describe('KycdocumentComponent', () => {
  let component: KycdocumentComponent;
  let fixture: ComponentFixture<KycdocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycdocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
