import { Injectable } from '@angular/core';
import * as basiclightbox from 'basiclightbox';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() {}

  image(src: string, options?: basiclightbox.BasicLightBoxOptions) {
    return basiclightbox.create(`<img src="${src}">`, options);
  }

  video(src: string, options?: basiclightbox.BasicLightBoxOptions) {
    return basiclightbox.create(`<video src="${src}" controls></video>`, options);
  }

  iframe(embeded: string, options?: basiclightbox.BasicLightBoxOptions) {
    return basiclightbox.create(embeded, options);
  }

  html(html: string, options?: basiclightbox.BasicLightBoxOptions) {
    return basiclightbox.create(html, options);
  }

  template(content: string | Element, options?: basiclightbox.BasicLightBoxOptions) {
    return basiclightbox.create(content, options);
  }
}
