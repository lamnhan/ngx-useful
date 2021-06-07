import { Component } from '@angular/core';
import { LocalstorageService, AppService, MetaService, NavService, SettingService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private localstorageService: LocalstorageService,
    private appService: AppService,
    private metaService: MetaService,
    private navService: NavService,
    private settingService: SettingService,
  ) {
    this.initialize();
  }

  private initialize() {
    this.localstorageService.init();
    this.appService.init({ splashScreen: true });
    this.settingService.init(
      {
        browserColor: true,
        onReady: () => this.appService.hideSplashScreen(),
      },
      {},
      {
        localstorageService: this.localstorageService,
      },
    );
    this.navService.init(
      {
        pageOffset: 114,
      },
      { settingService: this.settingService },
    );
    this.metaService.init(
      {
        title: 'Angular Useful',
        description: 'A collection of useful Angular services, pipes, ...',
        image: 'https://ngx-useful.lamnhan.com/assets/images/featured.jpg',
        url: 'https://ngx-useful.lamnhan.com/',
        lang: 'en',
        ogLocale: 'en-US',
        ogSiteName: 'Angular Useful'
      },
      {},
      { settingService: this.settingService },
    );
  }
}
