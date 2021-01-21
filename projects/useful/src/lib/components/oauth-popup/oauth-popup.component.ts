import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ln-oauth-popup',
  templateUrl: './oauth-popup.component.html',
  styleUrls: ['./oauth-popup.component.scss']
})
export class OauthPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if (window.opener !== null && !window.opener.closed) {
      window.opener.handleOauthResult(window.location.hash);
    }
    window.close();
  }

}
