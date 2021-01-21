import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthPopupComponent } from './oauth-popup.component';

describe('OauthPopupComponent', () => {
  let component: OauthPopupComponent;
  let fixture: ComponentFixture<OauthPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OauthPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
