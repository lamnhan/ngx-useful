import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-guard',
  templateUrl: './guard.component.html',
  styleUrls: ['./guard.component.scss']
})
export class GuardComponent implements OnInit {
  public readonly contentSrc$ = this.activatedRoute.params.pipe(
    map(params => `https://ngx-useful.lamnhan.com/content/guards/${params.id}.md`),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    public readonly data: DataService
  ) {}

  ngOnInit(): void {
  }

}
