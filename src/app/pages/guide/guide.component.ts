import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  public readonly contentSrc$ = this.activatedRoute.params.pipe(
    map(params => `https://raw.githubusercontent.com/lamnhan/ngx-useful/main/src/content/guides/${params.id}.md`),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    public readonly data: DataService
  ) {}

  ngOnInit(): void {
  }

}
