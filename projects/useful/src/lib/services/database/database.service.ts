import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';

export type NullableOptional<T> = PickRequired<T> & Nullable<PickOptional<T>>;

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

  exists(path: string, queryFn?: QueryFn) {
    return !queryFn 
      ? this.flatDoc(path).pipe(map(item => !!item))
      : this.flatCollection(path, queryFn).pipe(map(items => !!items.length));
  }

  doc<Type>(path: string) {
    return this.SERVICE.doc(path) as DatabaseItem<Type>;
  }

  collection<Type>(path: string, queryFn?: QueryFn) {
    return this.SERVICE.collection(path, queryFn) as DatabaseCollection<Type>;
  }

  flatDoc<Type>(path: string, queryFn?: QueryFn) {
    return !queryFn
      ? this.doc<Type>(path).get().pipe(
        map(doc => doc.data()),
        take(1)
      )
      : this.collection<Type>(path, queryFn).get().pipe(
        map(collection =>
          collection.docs.length === 1
          ? collection.docs[0].data()
          : undefined
        ),
        take(1)
      );
  }

  flatCollection<Type>(path: string, queryFn?: QueryFn) {
    return this.collection<Type>(path, queryFn).get().pipe(
      map(collection => collection.docs.map(doc => doc.data())),
      take(1)
    );
  }

  flatRecord<Type>(path: string, queryFn?: QueryFn) {
    return this.collection<Type>(path, queryFn).get().pipe(
      map(collection => {
        const record = {} as Record<string, Type>;
        collection.docs.forEach(doc => {
          const data = doc.data();
          record[(data as Record<string, unknown>).id as string] = data;
        });
        return record;
      }),
      take(1)
    );;
  }

  streamDoc<Type>(path: string, queryFn?: QueryFn) {
    return new Observable<Type | undefined>(observer =>
      !queryFn
        ? this.doc<Type>(path).ref.onSnapshot(doc => observer.next(doc.data()))
        : this.collection<Type>(path, queryFn).ref.onSnapshot(collection =>
          observer.next(collection.docs.length === 1 ? collection.docs[0].data() : undefined)
        )
    );
  }

  streamCollection<Type>(path: string, queryFn?: QueryFn) {
    return new Observable<Type[]>(observer =>
      this.collection<Type>(path, queryFn).ref.onSnapshot(collection =>
        observer.next(collection.docs.map(doc => doc.data() as Type))
      )
    );
  }

  streamRecord<Type>(path: string, queryFn?: QueryFn) {
    return new Observable<Record<string, Type>>(observer =>
      this.collection<Type>(path, queryFn).ref.onSnapshot(collection => {
        const record = {} as Record<string, Type>;
        collection.docs.forEach(doc => {
          const data = doc.data();
          record[(data as Record<string, unknown>).id as string] = data;
        });
        observer.next(record);
      })
    );
  }

  add<Type>(path: string, item: Type) {
    return this.set(path, item);
  }

  set<Type>(path: string, item: Type) {
    return from(this.doc(path).set(item));
  }

  update<Type>(path: string, item: Type) {
    return from(this.doc(path).update(item));
  }

  delete(path: string) {
    return from(this.doc(path).delete());
  }
}

export class DataService<Type extends Record<string, unknown>> {
  constructor(
    public readonly databaseService: DatabaseService,
    public readonly name: string
  ) {}

  exists(idOrQuery: string | QueryFn) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.exists(`${this.name}/${idOrQuery}`)
      : this.databaseService.exists(this.name, idOrQuery);
  }

  doc(id: string) {
    return this.databaseService.doc<Type>(`${this.name}/${id}`); 
  }

  collection(queryfn?: any) {
    return this.databaseService.collection<Type>(this.name, queryfn);
  }

  flatDoc(idOrQuery: string | QueryFn) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.flatDoc<Type>(`${this.name}/${idOrQuery}`)
      : this.databaseService.flatDoc<Type>(this.name, idOrQuery);
  }

  flatCollection(queryfn?: any) {
    return this.databaseService.flatCollection<Type>(this.name, queryfn);
  }

  flatRecord(queryfn?: any) {
    return this.databaseService.flatRecord<Type>(this.name, queryfn);
  }

  streamDoc(idOrQuery: string | QueryFn) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.streamDoc<Type>(`${this.name}/${idOrQuery}`)
      : this.databaseService.streamDoc<Type>(this.name, idOrQuery);
  }

  streamCollection(queryfn?: any) {
    return this.databaseService.streamCollection<Type>(this.name, queryfn);
  }

  streamRecord(queryfn?: any) {
    return this.databaseService.streamRecord<Type>(this.name, queryfn);
  }

  add(id: string, item: Type | NullableOptional<Type>) {
    return this.databaseService.add(`${this.name}/${id}`, item);
  }

  set(id: string, item: Type | NullableOptional<Type>) {
    return this.databaseService.set(`${this.name}/${id}`, item);
  }

  update(id: string, item: Partial<Type> | NullableOptional<Partial<Type>>) {
    return this.databaseService.update(`${this.name}/${id}`, item);
  }

  delete(id: string) {
    return this.databaseService.delete(`${this.name}/${id}`);
  }
}

type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T];
type PickRequired<T> = Pick<T, RequiredKeys<T>>;
type PickOptional<T> = Pick<T, OptionalKeys<T>>;
type Nullable<T> = { [P in keyof T]: T[P] | null };
