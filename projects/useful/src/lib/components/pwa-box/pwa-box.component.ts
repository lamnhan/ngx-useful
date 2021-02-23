import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {PwaService} from '../../services/pwa/pwa.service';

@Component({
  selector: 'useful-pwa-box',
  templateUrl: './pwa-box.component.html',
  styleUrls: ['./pwa-box.component.scss']
})
export class PwaBoxComponent implements OnInit {
  @Input('pwaService') pwa?: PwaService;

  @Input() title = 'Install app?';

  @Input() icon = '/icons/icon-72x72.png';
  @Input() name = 'Install now';
  @Input() tagline = 'Add app to your home screen';

  @Output() action: EventEmitter<void> = new EventEmitter();
  @Output() dismiss: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
