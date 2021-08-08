import { Injectable } from '@angular/core';
import { from, of, Observable, combineLatest } from 'rxjs';
import { map, take, tap, timeout, catchError } from 'rxjs/operators';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Meta } from '@lamnhan/schemata';

// @ts-ignore
import { Document } from 'flexsearch';

import { HelperService } from '../helper/helper.service';
import { CacheService, CacheConfig, Caching } from '../cache/cache.service';

export type NullableOptional<T> = PickRequired<T> & Nullable<PickOptional<T>>;

export type VendorDatabaseService = AngularFirestore;

export type DatabaseItem<T> = AngularFirestoreDocument<T>;

export type DatabaseCollection<T> = AngularFirestoreCollection<T>;

export interface DatabaseOptions {
  driver?: string;
  cacheTime?: number;
  prerendering?: boolean;
}

export interface DatabaseIntegrations {
  cacheService?: CacheService;
}

export interface DatabaseDataOptions {
  advancedMode?: boolean;
  metaCaching?: false | CacheConfig;
  autoloadSearching?: boolean;
  searchingCaching?: false | CacheConfig;
  flexsearchOptions?: any;
  predefinedContextuals?: Array<{ name: string, picker: DatabaseDataContextualPicker }>;
}

export interface DatabaseDataMetas {
  count?: number;
}

export interface DatabaseDataSearchIndexItem {
  content: string;
  [prop: string]: any;
}

export interface DatabaseDataSearchIndexLocalItem extends DatabaseDataSearchIndexItem {
  id: number;
  docId: string;
}

export interface DatabaseDataSearchIndex {
  items?: Record<string, DatabaseDataSearchIndexItem>;
}

export type DatabaseDataContextualPicker = (localIndexItem?: DatabaseDataSearchIndexLocalItem) => boolean;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private options: DatabaseOptions = {};
  private integrations: DatabaseIntegrations = {};
  private service!: VendorDatabaseService;
  driver = 'firebase';

  constructor(private readonly helperService: HelperService) {}

  setOptions(options: DatabaseOptions) {
    this.options = options;
    if (options.driver) {
      this.driver = options.driver;
    }
    return this as DatabaseService;
  }
  
  setIntegrations(integrations: DatabaseIntegrations) {
    this.integrations = integrations;
    return this as DatabaseService;
  }

  init(vendorService: VendorDatabaseService) {
    this.service = vendorService;
    return this as DatabaseService;
  }

  getValueIncrement(by = 1) {
    return firebase.firestore.FieldValue.increment(by);
  }

  getValueDelete() {
    return firebase.firestore.FieldValue.delete();
  }

  isTypeIncrement(value: any) {
    return value instanceof firebase.firestore.FieldValue
      && value.isEqual(this.getValueIncrement());
  }

  isTypeDelete(value: any) {
    return value instanceof firebase.firestore.FieldValue
      && value.isEqual(this.getValueDelete());
  }

  exists(path: string, queryFn?: QueryFn) {
    return !queryFn 
      ? this.flatDoc(path).pipe(map(item => !!item))
      : this.flatCollection(path, queryFn).pipe(map(items => !!(items || []).length));
  }

  doc<Type>(path: string) {
    return this.service.doc(path) as DatabaseItem<Type>;
  }

  collection<Type>(path: string, queryFn?: QueryFn) {
    return this.service.collection(path, queryFn) as DatabaseCollection<Type>;
  }

  set<Type>(path: string, item: Type) {
    return from(this.doc(path).set(item));
  }

  update<Type>(path: string, item: Type) {
    return from(this.doc(path).update(item));
  }

  increment(path: string, data: Record<string, number>) {
    const item = {} as Record<string, unknown>;
    Object.keys(data).forEach(field =>
      item[field] = this.getValueIncrement(data[field]));
    return this.update(path, item);
  }

  delete(path: string) {
    return from(this.doc(path).delete());
  }

  streamDoc<Type>(path: string, queryFn?: QueryFn) {
    return new Observable<null | Type>(observer =>
      !queryFn
        ? this.doc<Type>(path).ref.onSnapshot(doc => observer.next(doc.data()))
        : this.collection<Type>(path, queryFn).ref.onSnapshot(collection =>
          observer.next(collection.docs.length === 1 ? collection.docs[0].data() : null)
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

  flatDoc<Type>(path: string, queryFn?: QueryFn): Observable<null | Type> {
    // try to get item from prerender data
    const docId = queryFn ? null : path.split('/').pop() as string;
    const prerenderStringifiedData =
      (!this.options.prerendering || !window.sessionStorage || !docId)
      ? null
      : sessionStorage.getItem(`prerender_data:${docId}`);
    // result
    return prerenderStringifiedData
      ? of(JSON.parse(prerenderStringifiedData))
      : !queryFn
      ? this.doc<Type>(path).get().pipe(
        take(1),
        map(doc => doc.data() || null),
      )
      : this.collection<Type>(path, queryFn).get().pipe(
        take(1),
        map(collection => collection.docs.length === 1 ? collection.docs[0].data() : null),
      );
  }

  flatCollection<Type>(path: string, queryFn?: QueryFn) {
    return this.collection<Type>(path, queryFn).get().pipe(
      take(1),
      map(collection => collection.docs.map(doc => doc.data())),
    );
  }

  flatRecord<Type>(path: string, queryFn?: QueryFn) {
    return this.collection<Type>(path, queryFn).get().pipe(
      take(1),
      map(collection => {
        const record = {} as Record<string, Type>;
        collection.docs.forEach(doc => {
          const data = doc.data();
          record[(data as Record<string, unknown>).id as string] = data;
        });
        return record;
      }),
    );
  }

  getDoc<Type>(path: string, queryFn?: QueryFn, caching?: false | CacheConfig) {
    return caching === false
    ? this.flatDoc<Type>(path, queryFn)
    : this.cacheManager(
      this.flatDoc<Type>(path, queryFn),
      path,
      queryFn,
      caching,
    ) as Observable<null | Type>;
  }

  getCollection<Type>(path: string, queryFn?: QueryFn, caching?: false | CacheConfig) {
    return caching === false
    ? this.flatCollection<Type>(path, queryFn)
    : this.cacheManager(
      this.flatCollection<Type>(path, queryFn),
      path,
      queryFn,
      caching
    ) as Observable<Type[]>;
  }

  getRecord<Type>(path: string, queryFn?: QueryFn, caching?: false | CacheConfig) {
    return caching === false
    ? this.flatRecord<Type>(path, queryFn)
    : this.cacheManager(
      this.flatRecord<Type>(path, queryFn),
      path,
      queryFn,
      caching
    ) as Observable<Record<string, Type>>;
  }

  cachingDoc<Type>(path: string, queryFn?: QueryFn, caching?: CacheConfig) {
    return this.cacheManager(
      this.flatDoc<Type>(path, queryFn),
      path,
      queryFn,
      caching,
      true,
    ) as Caching<null | Type>;
  }

  cachingCollection<Type>(path: string, queryFn?: QueryFn, caching?: CacheConfig) {
    return this.cacheManager(
      this.flatCollection<Type>(path, queryFn),
      path,
      queryFn,
      caching,
      true,
    ) as Caching<Type[]>;
  }

  cachingRecord<Type>(path: string, queryFn?: QueryFn, caching?: CacheConfig) {
    return this.cacheManager(
      this.flatRecord<Type>(path, queryFn),
      path,
      queryFn,
      caching,
      true,
    ) as Caching<Record<string, Type>>;
  }

  private cacheManager<Type>(
    refresher: Observable<Type>,
    path: string,
    queryFn?: QueryFn,
    caching?: CacheConfig,
    asCaching = false,
  ) {
    if (!this.integrations.cacheService) {
      throw new Error('No cache service integration.');
    }
    if (queryFn && !caching?.name) {
      throw new Error('Querying without a cache name.');
    }
    const cacheTime = caching?.time || this.options.cacheTime || 1;
    const cacheId = this.helperService.md5(caching?.name || path);
    const cacheGroup = caching?.group || path.split('/').shift() as string;
    return asCaching
      ? this.integrations.cacheService.caching(
        `database/${cacheGroup}/${cacheId}`,
        refresher,
        cacheTime
      )
      : this.integrations.cacheService.get(
        `database/${cacheGroup}/${cacheId}`,
        refresher,
        cacheTime
      );
  }
}

export class DatabaseData<Type> {
  private options: DatabaseDataOptions = {};
  private metas: DatabaseDataMetas = {};

  private searchIndexingKeys: string[] = [];
  private searchIndexing: Record<string, DatabaseDataSearchIndexLocalItem> = {};

  private defaultIndex?: any;
  private contextualIndexes: Record<string, any> = {};

  constructor(
    public readonly databaseService: DatabaseService,
    public readonly name: string
  ) {}

  setOptions(options: DatabaseDataOptions = {}) {
    this.options = options;
    return this as DatabaseData<Type>;
  }

  init() {
    const { advancedMode, autoloadSearching } = this.options;
    if (advancedMode) {
      // load metas
      this.loadMetas();
      // load search indexing
      if (autoloadSearching) {
        this.loadSearching();
      }
    }
    return this as DatabaseData<Type>;
  }

  loadMetas() {
    return this.databaseService
      .getDoc<Meta>(`metas/${this.name}`, undefined, this.options.metaCaching)
      .pipe(
        tap(metaDoc => this.metas = (!metaDoc ? {} : metaDoc.value) as DatabaseDataMetas),
      );
  }

  loadSearching() {
    if (this.defaultIndex) {
      return of(this.defaultIndex);
    }
    return this.databaseService
      .getCollection<Meta>(
        'metas',
        ref => ref
          .where('master', '==', this.name)
          .where('group', '==', 'search_index')
          .orderBy('createdAt', 'desc'),
        this.options.searchingCaching,
      ).pipe(
        map(metaItems => {
          const defaultIndex = new Document({
            document: { index: 'content' },
            ...this.options.flexsearchOptions,
          });
          let indexId = 0;
          metaItems.forEach(metaItem => {
            const { items = {} } = metaItem.value as DatabaseDataSearchIndex;
            Object.keys(items).forEach(key => {
              // save key
              this.searchIndexingKeys.push(key);
              // save item
              this.searchIndexing[key] = {
                id: ++indexId,
                docId: key,
                ...items[key],
              } as DatabaseDataSearchIndexLocalItem;
              // register default index
              defaultIndex.add(this.searchIndexing[key]);
              // register contextual indexes
              if (this.options.predefinedContextuals) {
                this.options.predefinedContextuals.forEach(({name, picker}) =>
                  this.loadContextualSearching(name, picker, this.searchIndexing[key])
                );
              }
            });
          });
          return defaultIndex;
        }),
        tap(defaultIndex => this.defaultIndex = defaultIndex),
      );
  }

  loadContextualSearching(
    name: string,
    picker: DatabaseDataContextualPicker,
    localIndexItem?: DatabaseDataSearchIndexLocalItem
  ) {
    // no index, create new
    if (!this.contextualIndexes[name]) {
      this.contextualIndexes[name] = new Document({
        document: { index: 'content' },
        ...this.options.flexsearchOptions,
      });
    }
    // add item/items
    if (localIndexItem) {
      if (picker(localIndexItem)) {
        this.contextualIndexes[name].add(localIndexItem);
      }
    } else {
      this.searchIndexingKeys.forEach(key => {
        if (picker(this.searchIndexing[key])) {
          this.contextualIndexes[name].add(this.searchIndexing[key]);
        }
      });
    }
    // result
    return this.contextualIndexes[name];
  }

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

  add<AutoTimingType extends Omit<Type, 'createdAt' | 'updatedAt'>>(
    id: string,
    item: Type | AutoTimingType | NullableOptional<Type | AutoTimingType>
  ) {
    const createdAt = (item as any).createdAt as string || new Date().toISOString();
    const updatedAt = (item as any).updatedAt as string || createdAt;
    return this.set(
      id,
      {
        ...item,
        createdAt,
        updatedAt,
      } as unknown as Type | NullableOptional<Type>
    );
  }

  update<AutoTimingType extends Omit<Type, 'createdAt' | 'updatedAt'>>(
    id: string,
    item: Partial<AutoTimingType> | NullableOptional<Partial<AutoTimingType>>
  ) {
    const updatedAt = (item as any).updatedAt as string || new Date().toISOString();
    return this.databaseService.update(`${this.name}/${id}`, {...item, updatedAt});
  }

  increment(id: string, data: Record<string, number>) {
    return this.databaseService.increment(`${this.name}/${id}`, data);
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

  getDoc(idOrQuery: string | QueryFn, caching?: false | CacheConfig) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.getDoc<Type>(`${this.name}/${idOrQuery}`, undefined, caching)
      : this.databaseService.getDoc<Type>(this.name, idOrQuery, caching);
  }

  getCollection(queryFn?: QueryFn, caching?: false | CacheConfig) {
    return this.databaseService.getCollection<Type>(this.name, queryFn, caching);
  }

  getRecord(queryFn?: QueryFn, caching?: false | CacheConfig) {
    return this.databaseService.getRecord<Type>(this.name, queryFn, caching);
  }

  cachingDoc(idOrQuery: string | QueryFn, caching?: CacheConfig) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.cachingDoc<Type>(`${this.name}/${idOrQuery}`, undefined, caching)
      : this.databaseService.cachingDoc<Type>(this.name, idOrQuery, caching);
  }

  cachingCollection(queryFn?: QueryFn, caching?: CacheConfig) {
    return this.databaseService.cachingCollection<Type>(this.name, queryFn, caching);
  }

  cachingRecord(queryFn?: QueryFn, caching?: CacheConfig) {
    return this.databaseService.cachingRecord<Type>(this.name, queryFn, caching);
  }

  getItems(ids: string[], itemTimeout = 5000, caching?: false | CacheConfig) {
    return combineLatest(
      ids.map(id =>
        this.getDoc(id, caching).pipe(
          timeout(itemTimeout),
          catchError(() => of(null)),
        )
      )
    )
    .pipe(map(items => items.filter(item => !!item)));
  }

  lookup(keyword: string, limit = 10, lastItem?: Type, caching: false | CacheConfig = false) {
    return this.getCollection(ref =>
      {
        let query = ref
          .where('keywords', 'array-contains', keyword)
          .orderBy('createdAt', 'desc');
        if (lastItem) {
          query = query.startAfter((lastItem as any).createdAt);
        }
        return query.limit(limit);
      },
      caching,
    );
  }

  search(query: string, context?: string, limit = 10, caching?: false | CacheConfig) {
    const index = context ? this.contextualIndexes[context] : this.defaultIndex;
    if (!index) {
      throw new Error('No index found.');
    }
    const searchResult = index.search(query);
    return searchResult;
  }
}

type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T];
type PickRequired<T> = Pick<T, RequiredKeys<T>>;
type PickOptional<T> = Pick<T, OptionalKeys<T>>;
type Nullable<T> = { [P in keyof T]: T[P] | null };
