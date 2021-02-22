import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavIndicatorComponent } from './nav-indicator.component';

describe('NavIndicatorComponent', () => {
  let component: NavIndicatorComponent;
  let fixture: ComponentFixture<NavIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
