import { Component, OnInit, Input } from '@angular/core';

import { IconService } from '../../services/icon/icon.service';

@Component({
  selector: 'useful-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() id?: string;
  @Input() src?: string;
  @Input() alt?: string;

  isSvg = false;
  icon?: string;

  constructor(private iconService: IconService) {}

  ngOnInit() {
    const dynamicIcon = this.id ? this.iconService.getIcon(this.id) : null;
    this.icon = dynamicIcon || this.src;
    this.isSvg = !!this.icon?.endsWith('.svg');
  }
}
