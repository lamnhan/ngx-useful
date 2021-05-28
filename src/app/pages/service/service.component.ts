import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  public readonly contentSrc$ = this.activatedRoute.params.pipe(
    map(params => `https://ngx-useful.lamnhan.com/content/services/${params.id}.md`),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    public readonly data: DataService
  ) {}

  ngOnInit(): void {
  }

}
