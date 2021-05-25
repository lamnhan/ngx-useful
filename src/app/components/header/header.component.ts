import { Component, OnInit } from '@angular/core';
import { SettingService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public readonly setting: SettingService) { }

  ngOnInit(): void {}

  toggleTheme(e: any) {
    return this.setting.changeTheme(e.target.checked ? 'dark' : 'light');
  }

}
