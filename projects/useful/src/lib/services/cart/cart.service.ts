import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {
  Product,
  Promotion,
  OrderItem,
  OrderProduct,
  UserProfile,
  OrderDiscount,
  UserInfo
} from '@lamnhan/schemata';

import { HelperService } from '../helper/helper.service';
import { LocalstorageService } from '../localstorage/localstorage.service';

type AuthUser = UserInfo & Record<string, Function>;

type PromotionTypes = 'code' | 'auto' | 'custom';

type PromotionGrouping = {
  [type in PromotionTypes]: {
    [key: string]: Promotion;
  };
};

export interface CustomPromotionHelpers {
  [name: string]: (...args: any[]) => boolean;
}

interface CartShipping {
  defaultCost?: number;
  freeIfGreaterThan?: number;
  costCalculator?: (cartService: CartService) => number;
}

export interface CartOptions {
  shipping?: CartShipping;
  noLocal?: true;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private APP_LOCAL_CART_STORAGE_KEY = 'app_local_cart';

  private changeEventSource = new Subject<CartService>();
  onChange = this.changeEventSource.asObservable();

  private options: CartOptions = {};
  private customPromotionHelpers: CustomPromotionHelpers = {};
  private authUser?: AuthUser;
  private promoByGroups: PromotionGrouping = {
    code: {},
    auto: {},
    custom: {},
  };

  private items: Record<string, OrderItem> = {};
  private customer?: UserProfile;
  private discountData: Record<string, OrderDiscount> = {};
  private note = '';

  constructor(
    private helperService: HelperService,
    private localstorageService: LocalstorageService,
  ) {}

  init(
    options: CartOptions = {},
    customPromotionHelpers: CustomPromotionHelpers = {},
  ) {
    this.options = options;
    this.customPromotionHelpers = customPromotionHelpers;
    // on change
    this.onChange.subscribe(() => {
      // re-evaluate promotions
      this.applyAutoPromotion();
      this.applyCustomPromotion();
      // save cart locally
      this.saveLocalCart();
    });
    // load local cart
    this.loadLocalCart();
    // done
    return this as CartService;
  }
 
  loadLocalCart() {
    if (!this.options.noLocal) {
      this.localstorageService
        .get<any>(this.APP_LOCAL_CART_STORAGE_KEY)
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
          this.changeEventSource.next(this);
        });
    }
  }

  saveLocalCart() {
    if (!this.options.noLocal) {
      this.localstorageService
        .set(this.APP_LOCAL_CART_STORAGE_KEY, {
          items: this.items,
          customer: this.customer,
          discountData: this.discountData,
          note: this.note,
        });
    }
  }

  setAuthUser(user: AuthUser) {
    this.authUser = user;
    // set customer data based on the user
    if (this.authUser) {
      const {
        uid,
        email = '',
        phoneNumber = '',
        addresses = {}
      } = this.customer || {};
      const {
        uid: userUid,
        email: userEmail = '',
        phoneNumber: userPhoneNumber = '',
        addresses: userAddresses = {}
      } = this.authUser;
      this.customer = {
        uid: uid || userUid,
        email: email || userEmail,
        phoneNumber: phoneNumber || userPhoneNumber,
        addresses: addresses || userAddresses,
      };
    }
    return this as CartService;
  }

  setPromotions(promotions: Promotion[]) {
    promotions.forEach(promotion => {
      const { id, kind = 'auto', content } = promotion;
      if (content && kind.indexOf('code') > -1) {
        this.promoByGroups.code[content] = promotion;
      } else if (kind.indexOf('custom') > -1) {
        this.promoByGroups.custom[id] = promotion;
      } else {
        this.promoByGroups.auto[id] = promotion;
      }
    });
    return this as CartService;
  }

  count() {
    return Object.keys(this.items).length;
  }

  getSubtotal() {
    let subtotal = 0;
    for (const key of Object.keys(this.items)) {
      const {qty, product} = this.items[key];
      subtotal += Math.abs(qty) * (product.price || 0);
    }
    return subtotal;
  }

  getDiscountTotal() {
    let discountTotal = 0;
    for (const key of Object.keys(this.discountData)) {
      const { value } = this.discountData[key];
      let discountValue = 0;
      if (value > 0 && value < 1) {
        discountValue = this.getSubtotal() * value;
      } else {
        discountValue = value;
      }
      discountTotal += Math.abs(discountValue);
    }
    return discountTotal;
  }
  
  getShippingCost(customPrice?: number) {
    const {
      shipping: {
        defaultCost = 0,
        freeIfGreaterThan,
        costCalculator
      } = {}
    } = this.options;
    if (
      freeIfGreaterThan
      && (customPrice || (this.getSubtotal() - this.getDiscountTotal())) >= freeIfGreaterThan
    ) {
      return 0;
    } else if (costCalculator && costCalculator instanceof Function) {
      return costCalculator(this);
    } else {
      return defaultCost;
    }
  }

  gotTotal() {
    const price = this.getSubtotal() - this.getDiscountTotal();
    const total = price + this.getShippingCost(price);
    return total > 0 ? total : 0;
  }

  addItem(product: Product, qty = 1) {
    this.updateItem(product, qty);
  }

  updateItem(product: Product, qty = 1) {
    const { id, title, sku, price, unit, thumbnail } = product;
    const cartProduct: OrderProduct = { id, title, sku, price, unit, thumbnail };
    // modify the list
    this.items[id] = {
      qty: (this.items[id] && this.items[id].qty > qty)
        ? this.items[id].qty
        : qty, // choose higher qty
      at: new Date().toISOString(),
      product: cartProduct,
    };
    // finalization
    if (!this.items[id]) {
      // new item
    }
    // emit the event
    this.changeEventSource.next(this);
  }

  removeItem(key: string) {
    // delete item
    const items = { ... this.items };
    delete items[key];
    this.items = items;
    // emit the event
    this.changeEventSource.next(this);
  }

  updateQty(key: string, qty: number) {
    if (!!this.items[key]) {
      this.items[key].qty = !isNaN(qty) && qty > 0 ? qty : 1;
      this.items[key].at = new Date().toISOString();
      // finalization
      this.changeEventSource.next(this);
    }
  }

  increaseQty(key: string) {
    if (!!this.items[key]) {
      this.items[key].qty++;
      this.items[key].at = new Date().toISOString();
      // finalization
      this.changeEventSource.next(this);
    }
  }

  decreaseQty(key: string) {
    if (!!this.items[key] && this.items[key].qty > 1) {
      this.items[key].qty--;
      this.items[key].at = new Date().toISOString();
      // finalization
      this.changeEventSource.next(this);
    }
  }

  clear() {
    this.items = {};
    this.discountData = {};
    this.note = '';
    // emit the event
    this.changeEventSource.next(this);
  }

  setCustomer(customer: UserProfile) {
    this.customer = { ... this.customer, ... customer };
    // emit the event
    this.changeEventSource.next(this);
  }

  setNote(note: string) {
    this.note = note;
    // emit the event
    this.changeEventSource.next(this);
  }

  applyDiscountCode(code: string) {
    const codeMd5 = this.helperService.md5(code.toLowerCase());
    const { title, kind, value } = this.promoByGroups.code[codeMd5] || {};
    if (kind && value) {
      this.discountData[kind] = { title, value };
      this.changeEventSource.next(this);
    } else {
      throw new Error('Invalid code.');
    }
  }

  private applyAutoPromotion() {
    for (const key of Object.keys(this.promoByGroups.auto)) {
      const { title, kind, value } = this.promoByGroups.auto[key];
      if (kind && value) {
        this.discountData[kind] = { title, value };
      }
    }
  }

  private applyCustomPromotion() {
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
      user: this.authUser,
      now: new Date(),
      ...this.customPromotionHelpers,
      been,
      beenHours,
      beenDays,
    });
    // apply
    for (const key of Object.keys(this.promoByGroups.custom)) {
      const { title, value, kind, content } = this.promoByGroups.custom[key];
      if (kind) {
        if (value && content && executeCustomPromo(content)) {
          this.discountData[kind] = { title, value };
        } else {
          delete this.discountData[kind];
        }
      }
    }
  }
}
