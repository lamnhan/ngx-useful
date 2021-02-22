import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'useful-nav-indicator',
  templateUrl: './nav-indicator.component.html',
  styleUrls: ['./nav-indicator.component.scss']
})
export class NavIndicatorComponent implements OnInit {
  @Input('text') text = 'Please wait ...';
  @Input('icon') icon = '/assets/images/logo.svg';

  constructor() {}

  ngOnInit(): void {}
}
