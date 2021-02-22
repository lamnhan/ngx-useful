import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaReminderComponent } from './pwa-reminder.component';

describe('PwaReminderComponent', () => {
  let component: PwaReminderComponent;
  let fixture: ComponentFixture<PwaReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwaReminderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwaReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
