import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-useful',
  template: `
    <p>
      useful works!
    </p>
  `,
  styles: [
  ]
})
export class UsefulComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
