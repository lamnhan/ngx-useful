import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

  collection<Item>(path: string, queryFn?: any) {
    return this.SERVICE.collection(path, queryFn) as DatabaseCollection<Item>;
  }

  flatDoc<Item>(path: string) {
    return this.doc<Item>(path)
      .get()
      .pipe(
        map(doc => doc.data()),
        take(1)
      );
  }

  flatCollection<Item>(path: string, queryFn?: any) {
    return this.collection<Item>(path, queryFn)
      .get()
      .pipe(
        map(collection => collection.docs.map(doc => doc.data())),
        take(1)
      );
  }

  flatRecord<Item>(path: string, queryFn?: any) {
    return this.collection<Item>(path, queryFn)
    .get()
    .pipe(
      map(collection => {
        const record = {} as Record<string, Item>;
        collection.docs.forEach(doc => {
          const data = doc.data();
          record[(data as Record<string, unknown>).id as string] = data;
        });
        return record;
      }),
      take(1)
    );;
  }

  streamDoc<Item>(path: string) {
    return new Observable<Item>(observer =>
      this.doc<Item>(path)
        .ref
        .onSnapshot(doc => 
          observer.next(doc.data())
        )
    );
  }

  streamCollection<Item>(path: string, queryFn?: any) {
    return new Observable<Item[]>(observer =>
      this.collection<Item>(path, queryFn)
        .ref
        .onSnapshot(collection =>
          observer.next(collection.docs.map(doc => doc.data() as Item))
        )
    );
  }

  streamRecord<Item>(path: string, queryFn?: any) {
    return new Observable<Record<string, Item>>(observer =>
      this.collection<Item>(path, queryFn)
        .ref
        .onSnapshot(collection => {
          const record = {} as Record<string, Item>;
          collection.docs.forEach(doc => {
            const data = doc.data();
            record[(data as Record<string, unknown>).id as string] = data;
          });
          observer.next(record);
        })
    );
  }
}

export class DataService<Type> {
  constructor(
    public readonly databaseService: DatabaseService,
    public readonly name: string
  ) {}

  doc(id: string) {
    return this.databaseService.doc<Type>(`${this.name}/${id}`); 
  }

  collection(queryfn?: any) {
    return this.databaseService.collection<Type>(this.name, queryfn);
  }

  flatDoc(id: string) {
    return this.databaseService.flatDoc<Type>(`${this.name}/${id}`);
  }

  flatCollection(queryfn?: any) {
    return this.databaseService.flatCollection<Type>(this.name, queryfn);
  }

  flatRecord(queryfn?: any) {
    return this.databaseService.flatRecord<Type>(this.name, queryfn);
  }

  streamDoc(id: string) {
    return this.databaseService.streamDoc<Type>(`${this.name}/${id}`);
  }

  streamCollection(queryfn?: any) {
    return this.databaseService.streamCollection<Type>(this.name, queryfn);
  }

  streamRecord(queryfn?: any) {
    return this.databaseService.streamRecord<Type>(this.name, queryfn);
  }
}
