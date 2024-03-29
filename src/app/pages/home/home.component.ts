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
npm i @lamnhan/ngx-useful
\`\`\`

You may also [Unistylus](https://unistylus.lamnhan.com) (for theming):

\`\`\`sh
npm i @unistylus/core @unistylus/bootstrap
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
