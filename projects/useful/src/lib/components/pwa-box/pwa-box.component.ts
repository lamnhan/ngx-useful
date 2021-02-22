import { Component, OnInit, Input } from '@angular/core';

import {PwaService} from '../../services/pwa/pwa.service';

@Component({
  selector: 'useful-pwa-box',
  templateUrl: './pwa-box.component.html',
  styleUrls: ['./pwa-box.component.scss']
})
export class PwaBoxComponent implements OnInit {
  @Input('pwaService') pwa?: PwaService;

  @Input() icon = '/icons/icon-32x32.png';
  @Input() title = 'App';
  @Input() description = 'Add to your home screen.';

  @Input() dismissText = 'Don\'t care';
  @Input() actionText = 'Show me how';

  constructor() {}

  ngOnInit(): void {}
}
