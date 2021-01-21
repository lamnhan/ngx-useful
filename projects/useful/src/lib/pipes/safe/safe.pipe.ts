import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, html = true) {
    return !value ? '' : (html ? this.sanitizer.bypassSecurityTrustHtml(value) : this.sanitizer.bypassSecurityTrustResourceUrl(value));
  }

}
