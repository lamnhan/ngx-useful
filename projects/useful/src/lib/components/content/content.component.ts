import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'useful-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() content = '';
  @Input() contentSrc?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
