import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  styleUrls: ['./pipe.component.scss']
})
export class PipeComponent implements OnInit {
  public readonly contentSrc$ = this.activatedRoute.params.pipe(
    map(params => `https://ngx-useful.lamnhan.com/content/pipes/${params.id}.md`),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    public readonly data: DataService
  ) {}

  ngOnInit(): void {
  }

}
