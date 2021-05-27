import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header2ndComponent } from './header2nd.component';

describe('Header2ndComponent', () => {
  let component: Header2ndComponent;
  let fixture: ComponentFixture<Header2ndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Header2ndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Header2ndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
