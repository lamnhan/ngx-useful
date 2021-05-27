import { Component, OnInit, Input } from '@angular/core';
import { NavItem } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() menuName = '';
  @Input() menuItems: NavItem[] = [];
  @Input() content = '';
  @Input() contentSrc?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
