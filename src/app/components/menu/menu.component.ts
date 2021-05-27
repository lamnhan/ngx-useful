import { Component, OnInit, Input } from '@angular/core';
import { NavService, NavItem } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() name = 'Menu';
  @Input() items?: NavItem[];

  mobileMenuExpanded = false;

  constructor(public readonly nav: NavService) {}

  ngOnInit(): void {}
}
