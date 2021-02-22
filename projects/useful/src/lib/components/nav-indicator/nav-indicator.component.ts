import { Component, OnInit, Input } from '@angular/core';

import { NavService } from '../../services/nav/nav.service';

@Component({
  selector: 'useful-nav-indicator',
  templateUrl: './nav-indicator.component.html',
  styleUrls: ['./nav-indicator.component.scss']
})
export class NavIndicatorComponent implements OnInit {
  @Input('navService') nav?: NavService;

  @Input() icon = '/assets/images/logo.svg';
  @Input() text = 'Please wait ...';

  constructor() {}

  ngOnInit(): void {}
}
