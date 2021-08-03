import { Injectable } from '@angular/core';
import * as basiclightbox from 'basiclightbox';

export interface AlertConfig {
  message: string;
  title?: string;
  icon?: string;
  closeText?: string;
  closable?: boolean;
  width?: number;
}

export interface ConfirmConfig extends AlertConfig {
  confirmText?: string;
}

export interface PromptConfig extends ConfirmConfig {
  inputType?: string;
  inputPlaceholder?: string;
  inputValue?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {}

  alert(
    config: AlertConfig,
    closed?: (basicLightbox: basiclightbox.BasicLightBox) => void,
    showed?: (basicLightbox: basiclightbox.BasicLightBox) => void,
  ) {
    const { message, title, icon, closable, closeText } = config;
    // body
    const bodyArr: string[] = [];
    bodyArr.push('<div class="content">');
    if (icon) {
      bodyArr.push(`<p><img src="${icon}"></p>`);
    }
    bodyArr.push(`<p>${message}</p>`);
    bodyArr.push('</div>');
    // foot right
    const footRightArr: string[] = [];
    footRightArr.push(`<button id="close" class="button-primary">${closeText||'OK'}</button>`);
    // final content
    const html = this.buildHtml(
      config,
      bodyArr.join(''),
      '',
      footRightArr.join('')
    );
    // result
    return basiclightbox.create(
      html,
      {
        closable,
        onShow: instance => {
          const modalEl = instance.element();
          // dismiss
          if (title) {
            const headCloseButton = modalEl.querySelector('.head button');
            (headCloseButton as any).onclick = instance.close;
          }
          // close
          const footCloseButton = modalEl.querySelector('.foot button#close');
          (footCloseButton as any).onclick = instance.close;
          // done
          if (showed) {
            showed(instance);
          }
          return true;
        },
        onClose: instance => {
          if (closed) {
            closed(instance);
          }
          return true;
        },
      }
    );    
  }

  confirm(
    config: ConfirmConfig,
    closed?: (confirm: boolean, basicLightbox: basiclightbox.BasicLightBox) => void,
    showed?: (basicLightbox: basiclightbox.BasicLightBox) => void,
  ) {
    const { message, title, icon, closable, confirmText, closeText } = config;
    // body
    const bodyArr: string[] = [];
    bodyArr.push('<div class="content">');
    if (icon) {
      bodyArr.push(`<p><img src="${icon}"></p>`);
    }
    bodyArr.push(`<p>${message}</p>`);
    bodyArr.push('</div>');
    // foot left
    const footLeftArr: string[] = [];
    footLeftArr.push(`<button id="close" class="button">${closeText||'Cancel'}</button>`);
    // foot right
    const footRightArr: string[] = [];
    footRightArr.push(`<button id="confirm" class="button-primary">${confirmText||'Confirm'}</button>`);
    // final content
    const html = this.buildHtml(
      config,
      bodyArr.join(''),
      footLeftArr.join(''),
      footRightArr.join(''),
    );
    // result
    let isConfirm = false;
    return basiclightbox.create(
      html,
      {
        closable,
        onShow: instance => {
          const modalEl = instance.element();
          // dismiss
          if (title) {
            const headCloseButton = modalEl.querySelector('.head button');
            (headCloseButton as any).onclick = instance.close;
          }
          // close
          const footCloseButton = modalEl.querySelector('.foot button#close');
          (footCloseButton as any).onclick = instance.close;
          // confirm
          const confirmButton = modalEl.querySelector('.foot button#confirm');
          (confirmButton as any).onclick = (cb?: () => void) => {
            isConfirm = true;
            return instance.close(cb);
          };
          // done
          if (showed) {
            showed(instance);
          }
          return true;
        },
        onClose: instance => {
          if (closed) {
            closed(isConfirm, instance);
          }
          return true;
        },
      }
    );
  }

  prompt(
    config: PromptConfig,
    closed?: (value: any, basicLightbox: basiclightbox.BasicLightBox) => void,
    showed?: (basicLightbox: basiclightbox.BasicLightBox) => void,
  ) {
    const { message, title, icon, closable, confirmText, closeText, inputType = 'text', inputPlaceholder } = config;
    const inputValue = config.inputValue || (inputType === 'number' ? 0 : '');
    // body
    const bodyArr: string[] = [];
    bodyArr.push('<label class="content" for="input">');
    if (icon) {
      bodyArr.push(`<p><img src="${icon}"></p>`);
    }
    bodyArr.push(`<p>${message}</p>`);
    bodyArr.push('</label>');
    if (inputType === 'textarea') {
      bodyArr.push(`<textarea id="input" class="form-control"${!inputPlaceholder ? '' : ` placeholder="${inputPlaceholder}"`}>${inputValue}</textarea>`);
    } else {
      bodyArr.push(`<input id="input" class="form-control" type="${inputType}" value="${inputValue}"${!inputPlaceholder ? '' : ` placeholder="${inputPlaceholder}"`}>`);
    }
    // foot left
    const footLeftArr: string[] = [];
    footLeftArr.push(`<button id="close" class="button">${closeText||'Cancel'}</button>`);
    // foot right
    const footRightArr: string[] = [];
    footRightArr.push(`<button id="confirm" class="button-primary">${confirmText||'Confirm'}</button>`);
    // final content
    const html = this.buildHtml(
      config,
      bodyArr.join(''),
      footLeftArr.join(''),
      footRightArr.join(''),
    );
    // result
    let value: any = '';
    return basiclightbox.create(
      html,
      {
        closable,
        onShow: instance => {
          const modalEl = instance.element();
          // dismiss
          if (title) {
            const headCloseButton = modalEl.querySelector('.head button');
            (headCloseButton as any).onclick = instance.close;
          }
          // close
          const footCloseButton = modalEl.querySelector('.foot button#close');
          (footCloseButton as any).onclick = instance.close;
          // confirm
          const confirmButton = modalEl.querySelector('.foot button#confirm');
          (confirmButton as any).onclick = (cb?: () => void) => {
            const inputEl = modalEl.querySelector('.body #input');
            value = (inputEl as any).value;
            return instance.close(cb);
          };
          // done
          if (showed) {
            showed(instance);
          }
          return true;
        },
        onClose: instance => {
          if (closed) {
            closed(value, instance);
          }
          return true;
        },
      }
    );
  }

  private buildHtml(
    config: AlertConfig,
    bodyHtml: string,
    footLeftHtml: string,
    footRightHtml: string,
  ) {
    const { title, width } = config;
    const htmlArr: string[] = [];
    // open
    htmlArr.push(`<div class="modal-alert"${!width ? '' : ` style="width:${width}px;"`}>`);
    // head
    if (title) {
      htmlArr.push(`
        <div class="head">
          <strong>${title}</strong>
          <button class="button-clear">×</button>
        </div>
      `);
    }
    // body
    htmlArr.push('<div class="body">');
    htmlArr.push(bodyHtml);
    htmlArr.push('</div>');
    // foot
    htmlArr.push('<div class="foot">');
    htmlArr.push(`<div class="left">${footLeftHtml}</div>`);
    htmlArr.push(`<div class="right">${footRightHtml}</div>`);
    htmlArr.push('</div>');
    // close
    htmlArr.push('</div>');
    // result
    return htmlArr.join('');
  }

}
