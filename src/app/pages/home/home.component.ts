import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  installContent =
`Using NPM:
\`\`\`sh
npm install --save @lamnhan/ngx-useful@0.0.9
\`\`\`

You may also [@lamnhan/unistylus](https://unistylus.lamnhan.com) (for theming):
\`\`\`sh
npm install --save @lamnhan/unistylus@0.0.10
\`\`\`
`;

  usageContent =
`Three steps to use a service:
\`\`\`ts
// 1. provide services in ---> app.module.ts
{ ..., providers: [AppService], ... }

// 2. init services in ---> app.component.ts
this.appService.init(...);

// 3. inject where needed
constructor(private appService: AppService) {}
\`\`\``;

  constructor() { }

  ngOnInit(): void {
  }

}
