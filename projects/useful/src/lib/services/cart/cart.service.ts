import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Product, Promotion, OrderItem, OrderProduct, UserProfile, OrderDiscount } from '@lamnhan/schemata';
import { AuthUser } from '@sheetbase/client';

import { AppService } from '../app/app.service';
import { LocalstorageService } from '../../sheetbase-services/localstorage/localstorage.service';

type PromotionGroup = {
  [type in 'CODE' | 'AUTO' | 'CUSTOM']: {
    [key: string]: Promotion;
  };
};

interface PromotionHelpers {
  [name: string]: (...args: any[]) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private SHEETBASE_LOCAL_CART = 'local_cart';
  private customPromotionHelpers: PromotionHelpers;

  // events
  private changeEventSource = new Subject<void>();
  onChange = this.changeEventSource.asObservable();

  // app data
  user: AuthUser;
  promoGroup: PromotionGroup = {
    AUTO: {},
    CODE: {},
    CUSTOM: {},
  };

  // cart data
  items: {[key: string]: OrderItem} = {};
  customer: UserProfile = {};
  discountData: {[type: string]: OrderDiscount} = {};
  note = '';
  shipping: any;

  constructor(
    private localstorageService: LocalstorageService,
    public appService: AppService,
  ) {
    // register change event listener
    this.onChange.subscribe(() => {
      // re-evaluate promotions
      this.applyPromotions();
      // re-calculate the shipping cost
      if (!!this.appService.options.shipping) {
        this.getShippingCost();
      }
      // save cart locally
      this.localstorageService.set(this.SHEETBASE_LOCAL_CART, {
        items: this.items,
        customer: this.customer,
        discountData: this.discountData,
        note: this.note,
      });
    });
    // load local cart
    this.localstorageService.get<any>(this.SHEETBASE_LOCAL_CART)
    .subscribe(localCart => {
      // patch data
      const {
        items = {},
        customer = {},
        discountData = {},
        note = '',
      } = localCart || {};
      this.items = items;
      this.customer = customer;
      this.discountData = discountData;
      this.note = note;
      // emit the events
      this.changeEventSource.next();
    });
  }

  setUser(user: AuthUser): CartService {
    this.user = user;
    // set customer data based on the user
    if (!!user) {
      const { email = '', phoneNumber = '', addresses = {} } = this.customer;
      const { email: userEmail = '', phoneNumber: userPhoneNumber = '', addresses: userAddresses = {} } = this.user;
      this.customer = {
        email: email || userEmail,
        phoneNumber: phoneNumber || userPhoneNumber,
        addresses: addresses || userAddresses,
      };
    }
    return this;
  }

  setPromos(promotions: Promotion[]): CartService {
    // sort promotions into groups
    for (let i = 0; i < (promotions || []).length; i++) {
      const promotion = promotions[i];
      const { $key, kind, content } = promotion;
      if (kind.indexOf('CODE') > -1) {
        this.promoGroup.CODE[content] = promotion;
      } else if (kind.indexOf('CUSTOM') > -1) {
        this.promoGroup.CUSTOM[$key] = promotion;
      } else if (kind.indexOf('AUTO') > -1) {
        this.promoGroup.AUTO[$key] = promotion;
      }
    }
    return this;
  }

  setPromotionHelpers(helpers: PromotionHelpers): CartService {
    this.customPromotionHelpers = helpers;
    return this;
  }

  count() {
    return Object.keys(this.items).length;
  }

  subtotal() {
    let subtotal = 0;
    for (const key of Object.keys(this.items)) {
      const item = this.items[key];
      subtotal += Math.abs(item.qty) * item.product.price;
    }
    return subtotal;
  }

  discountTotal() {
    let discountTotal = 0;
    for (const key of Object.keys(this.discountData)) {
      const { value } = this.discountData[key];
      let discountValue = 0;
      if (value > 0 && value < 1) {
        discountValue = this.subtotal() * value;
      } else {
        discountValue = value;
      }
      discountTotal += Math.abs(discountValue);
    }
    return discountTotal;
  }

  total() {
    const total = this.subtotal()
      - this.discountTotal()
      + (this.shipping ? this.shipping.cost : 0);
    return total > 0 ? total : 0;
  }

  addItem(product: Product, qty = 1) {
    this.updateItem(product, qty);
  }

  updateItem(product: Product, qty = 1) {
    const { $key, title, sku, price, unit, thumbnail } = product;
    const cartProduct: OrderProduct = { _id: $key, title, sku, price, unit, thumbnail };
    // modify the list
    this.items[$key] = {
      qty: (!!this.items[$key] && this.items[$key].qty > qty) ? this.items[$key].qty : qty, // choose higher qty
      at: new Date().toISOString(),
      product: cartProduct,
    };
    // finalization
    if (!this.items[$key]) {
      // new item
    }
    // emit the event
    this.changeEventSource.next();
  }

  removeItem(key: string) {
    // delete item
    const items = { ... this.items };
    delete items[key];
    this.items = items;
    // emit the event
    this.changeEventSource.next();
  }

  updateQty(key: string, qty: number) {
    if (!!this.items[key]) {
      this.items[key].qty = !isNaN(qty) && qty > 0 ? qty : 1;
      this.items[key].at = new Date().toISOString();
      // finalization
      this.changeEventSource.next();
    }
  }

  increaseQty(key: string) {
    if (!!this.items[key]) {
      this.items[key].qty++;
      this.items[key].at = new Date().toISOString();
      // finalization
      this.changeEventSource.next();
    }
  }

  decreaseQty(key: string) {
    if (!!this.items[key] && this.items[key].qty > 1) {
      this.items[key].qty--;
      this.items[key].at = new Date().toISOString();
      // finalization
      this.changeEventSource.next();
    }
  }

  clear() {
    this.items = {};
    this.discountData = {};
    this.note = '';
    // emit the event
    this.changeEventSource.next();
  }

  setCustomer(customer: UserProfile) {
    this.customer = { ... this.customer, ... customer };
    // emit the event
    this.changeEventSource.next();
  }

  setNote(note: string) {
    this.note = note;
    // emit the event
    this.changeEventSource.next();
  }

  applyDiscountCode(code: string) {
    const discount = this.promoGroup.CODE[
      code.toLowerCase()
    ];
    if (!!discount) {
      const { title, kind, value } = discount;
      this.discountData[kind] = { title, value };
      // emit the event
      this.changeEventSource.next();
    } else {
      throw new Error('Invalid code.');
    }
  }

  private applyPromotions() {
    this.applyAutoPromotions();
    this.applyCustomPromotions();
  }

  private applyAutoPromotions() {
    for (const key of Object.keys(this.promoGroup.AUTO)) {
      const { title, kind, value } = this.promoGroup.AUTO[key];
      this.discountData[kind] = { title, value };
    }
  }

  private applyCustomPromotions() {
    const executeCode = (code: string, input: {[key: string]: any}): boolean => {
      const body = `
        Object.keys(input).map(function (k) {
          this[k] = input[k];
        });
        return ${code};
      `;
      // run
      try {
        const executor = new Function('input', body);
        return executor(input);
      } catch (error) {
        return false;
      }
    };
    // default helpers
    const been = (date: string, modifier = 1000) => {
      return Math.ceil((new Date().getTime() - new Date(date).getTime()) / modifier);
    };
    const beenHours = (date: string) => {
      return been(date, 3600000);
    };
    const beenDays = (date: string) => {
      return been(date, 86400000);
    };
    // executor
    const executeCustomPromo = (script: string) => executeCode(script, {
      cart: this,
      user: this.user,
      now: new Date(),
      ... this.customPromotionHelpers,
      been,
      beenHours,
      beenDays,
    });
    for (const key of Object.keys(this.promoGroup.CUSTOM)) {
      const { title, kind, value, content } = this.promoGroup.CUSTOM[key];
      if (!!executeCustomPromo(content)) {
        this.discountData[kind] = { title, value };
      } else {
        delete this.discountData[kind];
      }
    }
  }

  getShippingCost() {
    const shipping = { ... this.appService.options.shipping };
    // overide cost
    const price = this.subtotal() - this.discountTotal();
    if (!!shipping.forFree && price >= shipping.forFree) {
      shipping.cost = 0;
    }
    this.shipping = shipping;
  }

}
