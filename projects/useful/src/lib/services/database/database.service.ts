import { Injectable } from '@angular/core';
import { of, from, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';

import { HelperService } from '../helper/helper.service';
import { CacheService, CacheCaching } from '../cache/cache.service';
import { SettingService } from '../setting/setting.service';

export type NullableOptional<T> = PickRequired<T> & Nullable<PickOptional<T>>;

export type VendorDatabaseService = AngularFirestore;

export type DatabaseItem<T> = AngularFirestoreDocument<T>;

export type DatabaseCollection<T> = AngularFirestoreCollection<T>;

export interface DatabaseOptions {
  driver?: string;
  cacheTime?: number;
}

export interface DatabaseIntegrations {
  cacheService?: CacheService;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private service!: VendorDatabaseService;
  private options: DatabaseOptions = {};
  private integrations: DatabaseIntegrations = {};

  constructor(private readonly helperService: HelperService) {}

  init(
    service: VendorDatabaseService,
    options: DatabaseOptions = {},
    integrations: DatabaseIntegrations = {},
  ) {
    this.service = service;
    this.options = options;
    this.integrations = integrations;
    // done
    return this as DatabaseService;
  }

  get SERVICE() {
    return this.service;
  }

  get DRIVER() {
    return this.options.driver || 'firebase';
  }

  exists(path: string, queryFn?: QueryFn) {
    return !queryFn 
      ? this.flatDoc(path).pipe(map(item => !!item))
      : this.flatCollection(path, queryFn).pipe(map(items => !!(items || []).length));
  }

  doc<Type>(path: string) {
    return this.SERVICE.doc(path) as DatabaseItem<Type>;
  }

  collection<Type>(path: string, queryFn?: QueryFn) {
    return this.SERVICE.collection(path, queryFn) as DatabaseCollection<Type>;
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

  flatDoc<Type>(path: string, queryFn?: QueryFn) {
    return !queryFn
      ? this.doc<Type>(path).get().pipe(
        map(doc => doc.data() || null),
        take(1)
      )
      : this.collection<Type>(path, queryFn).get().pipe(
        map(collection =>
          collection.docs.length === 1
          ? collection.docs[0].data()
          : null
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
    )
  }

  cachingDoc<Type>(
    path: string,
    queryFn?: QueryFn,
    caching?: CacheCaching
  ) {
    return this.getCachingData(
      this.flatDoc<Type>(path, queryFn),
      path,
      queryFn,
      caching,
    );
  }

  cachingCollection<Type>(
    path: string,
    queryFn?: QueryFn,
    caching?: CacheCaching
  ) {
    return this.getCachingData(
      this.flatCollection<Type>(path, queryFn),
      path,
      queryFn,
      caching,
    );
  }

  cachingRecord<Type>(
    path: string,
    queryFn?: QueryFn,
    caching?: CacheCaching
  ) {
    return this.getCachingData(
      this.flatRecord<Type>(path, queryFn),
      path,
      queryFn,
      caching,
    );
  }

  private getCachingData<Type>(
    dataFetcher: Observable<Type>,
    path: string,
    queryFn?: QueryFn,
    caching?: CacheCaching,
  ) {
    if (!this.integrations.cacheService) {
      throw new Error('No cache service integration');
    }
    if (queryFn && !caching?.id) {
      throw new Error('Querying without a cache id');
    }
    const cacheTime = caching?.time || this.options.cacheTime || 0;
    const cacheId = this.helperService.md5(caching?.id || path);
    const cacheGroup = caching?.group || path.split('/').shift() as string;
    return this.integrations.cacheService.caching(
      `database/${cacheGroup}/${cacheId}`,
      dataFetcher,
      cacheTime
    );
  }
}

export class DataService<Type> {
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

  collection(queryFn?: QueryFn) {
    return this.databaseService.collection<Type>(this.name, queryFn);
  }

  set(id: string, item: Type | NullableOptional<Type>) {
    return this.databaseService.set(`${this.name}/${id}`, item);
  }

  add(id: string, item: Type | NullableOptional<Type>) {
    const createdAt = new Date().toISOString();
    return this.set(id, {...item, createdAt, updatedAt: createdAt});
  }

  update(id: string, item: Partial<Type> | NullableOptional<Partial<Type>>) {
    const updatedAt = new Date().toISOString();
    return this.databaseService.update(`${this.name}/${id}`, {...item, updatedAt});
  }

  trash(id: string) {
    return this.update(id, {status: 'trash'} as unknown as Partial<Type>);
  }

  delete(id: string) {
    return this.databaseService.delete(`${this.name}/${id}`);
  }

  streamDoc(idOrQuery: string | QueryFn) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.streamDoc<Type>(`${this.name}/${idOrQuery}`)
      : this.databaseService.streamDoc<Type>(this.name, idOrQuery);
  }

  streamCollection(queryFn?: QueryFn) {
    return this.databaseService.streamCollection<Type>(this.name, queryFn);
  }

  streamRecord(queryFn?: QueryFn) {
    return this.databaseService.streamRecord<Type>(this.name, queryFn);
  }

  flatDoc(idOrQuery: string | QueryFn) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.flatDoc<Type>(`${this.name}/${idOrQuery}`)
      : this.databaseService.flatDoc<Type>(this.name, idOrQuery);
  }

  flatCollection(queryFn?: QueryFn) {
    return this.databaseService.flatCollection<Type>(this.name, queryFn);
  }

  flatRecord(queryFn?: QueryFn) {
    return this.databaseService.flatRecord<Type>(this.name, queryFn);
  }

  cachingDoc(idOrQuery: string | QueryFn, caching?: CacheCaching) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.cachingDoc<Type>(`${this.name}/${idOrQuery}`, undefined, caching)
      : this.databaseService.cachingDoc<Type>(this.name, idOrQuery, caching);
  }

  cachingCollection(queryFn?: QueryFn, caching?: CacheCaching) {
    return this.databaseService.cachingCollection<Type>(this.name, queryFn, caching);
  }

  cachingRecord(queryFn?: QueryFn, caching?: CacheCaching) {
    return this.databaseService.cachingRecord<Type>(this.name, queryFn, caching);
  }
}

type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T];
type PickRequired<T> = Pick<T, RequiredKeys<T>>;
type PickOptional<T> = Pick<T, OptionalKeys<T>>;
type Nullable<T> = { [P in keyof T]: T[P] | null };
