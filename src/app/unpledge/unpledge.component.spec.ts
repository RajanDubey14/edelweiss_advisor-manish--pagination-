import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpledgeComponent } from './unpledge.component';

describe('UnpledgeComponent', () => {
  let component: UnpledgeComponent;
  let fixture: ComponentFixture<UnpledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpledgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
