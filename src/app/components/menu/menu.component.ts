import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavItem } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() name = 'Menu';
  @Input() items?: NavItem[];

  @Output() select: EventEmitter<NavItem> = new EventEmitter(); 

  mobileMenuExpanded = false;

  constructor() {}

  ngOnInit(): void {}
}
