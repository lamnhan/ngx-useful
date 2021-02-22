import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaBoxComponent } from './pwa-box.component';

describe('PwaBoxComponent', () => {
  let component: PwaBoxComponent;
  let fixture: ComponentFixture<PwaBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwaBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwaBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
