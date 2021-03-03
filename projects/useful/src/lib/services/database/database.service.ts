import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

export type VendorDatabaseService = AngularFirestore;

export type DatabaseItem<T> = AngularFirestoreDocument<T>;

export type DatabaseCollection<T> = AngularFirestoreCollection<T>;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private driver?: string;
  private service?: VendorDatabaseService;

  constructor() {}

  init(service: VendorDatabaseService, driver?: string) {
    this.service = service;
    this.driver = driver || (service as any).name;
    // done
    return this as DatabaseService;
  }

  get DRIVER() {
    if (!this.driver) {
      throw new Error('Invalid driver, please provide when init().');
    }
    return this.driver;
  }

  get SERVICE() {
    if (!this.service) {
      throw new Error('No auth service, please run init() first!');
    }
    return this.service;
  }

  doc<Item>(path: string) {
    return this.SERVICE.doc(path) as DatabaseItem<Item>;
  }

  collection<Item>(path: string, queryFn: any) {
    return this.SERVICE.collection(path, queryFn) as DatabaseCollection<Item>;
  }
}
