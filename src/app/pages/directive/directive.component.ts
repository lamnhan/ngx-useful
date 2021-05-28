import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-directive',
  templateUrl: './directive.component.html',
  styleUrls: ['./directive.component.scss']
})
export class DirectiveComponent implements OnInit {
  public readonly contentSrc$ = this.activatedRoute.params.pipe(
    map(params => `https://ngx-useful.lamnhan.com/content/directives/${params.id}.md`),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    public readonly data: DataService
  ) {}

  ngOnInit(): void {
  }

}
