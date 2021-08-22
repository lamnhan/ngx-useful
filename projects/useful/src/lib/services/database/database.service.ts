// @ts-ignore
import { Document } from 'flexsearch';
import { Injectable } from '@angular/core';
import { from, of, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap, timeout, catchError } from 'rxjs/operators';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Meta } from '@lamnhan/schemata';

import { HelperService } from '../helper/helper.service';
import { CacheService, CacheConfig, Caching } from '../cache/cache.service';
import { SettingService } from '../setting/setting.service';
import { UserService } from '../user/user.service';

/*
 * ====================================================================================
 * ============================== DATABASE SERVICE ====================================
 * ==================================================================================== 
 */

type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K }[keyof T];
type OptionalKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T];
type PickRequired<T> = Pick<T, RequiredKeys<T>>;
type PickOptional<T> = Pick<T, OptionalKeys<T>>;
type Nullable<T> = { [P in keyof T]: T[P] | null };

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
  settingService?: SettingService;
  userService?: UserService;
}

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

  getOptions() {
    return this.options;
  }

  getIntegrations() {
    return this.integrations;
  }

  getVendorService() {
    return this.service;
  }

  getValueIncrement(by = 1) {
    return firebase.firestore.FieldValue.increment(by);
  }

  isTypeIncrement(value: any) {
    return value instanceof firebase.firestore.FieldValue
      && value.isEqual(this.getValueIncrement());
  }

  getValueDelete() {
    return firebase.firestore.FieldValue.delete();
  }

  isTypeDelete(value: any) {
    return value instanceof firebase.firestore.FieldValue
      && value.isEqual(this.getValueDelete());
  }

  isGlobalCachingEnabled() {
    return !!this.options.cacheTime;
  }

  createId() {
    return this.service.createId();
  }

  exists(path: string, queryFn?: QueryFn) {
    return !queryFn 
      ? this.flatGet(path).pipe(map(item => !!item))
      : this.flatList(path, queryFn).pipe(map(items => !!(items || []).length));
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

  streamGet<Type>(path: string, queryFn?: QueryFn) {
    return new Observable<null | Type>(observer =>
      !queryFn
        ? this.doc<Type>(path).ref.onSnapshot(doc => observer.next(doc.data()))
        : this.collection<Type>(path, queryFn).ref.onSnapshot(collection =>
          observer.next(collection.docs.length === 1 ? collection.docs[0].data() : null)
        )
    );
  }

  streamList<Type>(path: string, queryFn?: QueryFn) {
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

  flatGet<Type>(path: string, queryFn?: QueryFn): Observable<null | Type> {
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

  flatList<Type>(path: string, queryFn?: QueryFn) {
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

  get<Type>(path: string, queryFn?: QueryFn, caching?: false | CacheConfig) {
    return caching === false
    ? this.flatGet<Type>(path, queryFn)
    : this.cacheManager(
      this.flatGet<Type>(path, queryFn),
      path,
      queryFn,
      caching,
    ) as Observable<null | Type>;
  }

  list<Type>(path: string, queryFn?: QueryFn, caching?: false | CacheConfig) {
    return caching === false
    ? this.flatList<Type>(path, queryFn)
    : this.cacheManager(
      this.flatList<Type>(path, queryFn),
      path,
      queryFn,
      caching
    ) as Observable<Type[]>;
  }

  record<Type>(path: string, queryFn?: QueryFn, caching?: false | CacheConfig) {
    return caching === false
    ? this.flatRecord<Type>(path, queryFn)
    : this.cacheManager(
      this.flatRecord<Type>(path, queryFn),
      path,
      queryFn,
      caching
    ) as Observable<Record<string, Type>>;
  }

  cachingGet<Type>(path: string, queryFn?: QueryFn, caching?: CacheConfig) {
    return this.cacheManager(
      this.flatGet<Type>(path, queryFn),
      path,
      queryFn,
      caching,
      true,
    ) as Caching<null | Type>;
  }

  cachingList<Type>(path: string, queryFn?: QueryFn, caching?: CacheConfig) {
    return this.cacheManager(
      this.flatList<Type>(path, queryFn),
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

/*
 * ====================================================================================
 * ============================ DATABASE DATA SERVICE =================================
 * ==================================================================================== 
 */

export interface DatabaseDataOptions {
  advancedMode?: boolean;
  // meta
  metaCaching?: false | CacheConfig;
  // searching
  searchCaching?: false | CacheConfig;
  searchIndexingRetrievalLimit?: number;
  searchIndexingBuildItemExtender?: DatabaseDataSearchIndexingBuildItemExtender;
  searchIndexingCheckUpdateExtender?: DatabaseDataSearchIndexingCheckUpdateExtender;
  predefinedSearchingContextuals?: Array<{ name: string, picker: DatabaseDataSearchingContextualPicker }>;
  flexsearchOptions?: any;
  // linking and effect
  linkingFields?: string[];
  linkingHook?: DatabaseDataLinkingHook;
  updateEffects?: DatabaseDataUpdateEffect[];
  effectDataPickers?: Record<string, (propData: any, fullData: any) => any>;
  // doc meta
  docMetaRegistry?: Record<string, DatabaseDataItemMetaRegistry>;
}

export type DatabaseDataSearchIndexingBuildItemExtender = (data: any) => Record<string, any>;
export type DatabaseDataSearchIndexingCheckUpdateExtender = (data: any) => boolean;
export type DatabaseDataSearchingContextualPicker = (localIndexingItem?: DatabaseDataSearchIndexingLocalItem) => boolean;
export type DatabaseDataLinkingHook = (mode: DatabaseDataLinkingMode, item: any, dataService: DatabaseData<any>) => Observable<any>;

export interface DatabaseDataItemMetaRegistry {
  group: string;
  valueBuilder: (id: string, docData: any, selfData: Meta) => Observable<any>;
}

export interface DatabaseDataCollectionMetas {
  documentCounting?: DatabaseDataCollectionMetaDocumentCouting;
  searchIndexing?: DatabaseDataCollectionMetaSearchIndexing;
}

export interface DatabaseDataCollectionMetaDocumentCouting {
  // group by type
  [type: string]: {
    // group by locale
    [locale: string]: {
      // count by status
      [status: string]: number;
    };
  };
}

export interface DatabaseDataCollectionMetaSearchIndexing {
  currentId: string;
  map: {
    [id: string]: {
      count: number;
      nextId?: string;
    };
  };
}

  export interface DatabaseDataSearchIndexingItem {
  content: string;
  createdAt: string;
  type: string;
  status: string;
  locale?: string;
  [prop: string]: any;
}

export interface DatabaseDataSearchIndexingLocalItem extends DatabaseDataSearchIndexingItem {
  id: number;
  docId: string;
}

export interface DatabaseDataSearchIndexing {
  items?: Record<string, DatabaseDataSearchIndexingItem>;
}

export interface FlexsearchDocumentIndex {
  add: (doc: Record<string, any>) => any;
  search: (query: string, ...args: any[]) => Array<undefined | {result: number[]}>;
}

export interface DatabaseDataSearchingData {
  indexingKeys: string[];
  indexingItems: Record<string, DatabaseDataSearchIndexingLocalItem>;
  defaultIndex: FlexsearchDocumentIndex;
  contextualIndexes: Record<string, FlexsearchDocumentIndex>;
}

export interface DatabaseDataUpdateEffect {
  collection: string;
  key: string;
}

export interface DatabaseDataEffectedTask {
  count: number;
  percentage$: Observable<number>;
}

export interface DatabaseDataLookupInput {
  keyword: string;
  type: string;
  status: string;
  locale?: string;
}

export type DatabaseDataLinkingMode = 'create' | 'update' | 'delete';

export class DatabaseData<Type> {
  private metas: DatabaseDataCollectionMetas = {};

  private searchIndexingKeys: string[] = [];
  private searchIndexingItems: Record<string, DatabaseDataSearchIndexingLocalItem> = {};
  private lastSearchRetrieval?: Meta;

  private defaultIndex?: FlexsearchDocumentIndex;
  private contextualIndexes: Record<string, FlexsearchDocumentIndex> = {};

  private readonly minimumLinkingFields = ['id', 'title', 'type'];

  constructor(
    public readonly databaseService: DatabaseService,
    public readonly name: string,
    private options: DatabaseDataOptions = {},
  ) {}

  setOptions(options: DatabaseDataOptions) {
    this.options = { ...this.options, ...options };
    return this as DatabaseData<Type>;
  }

  init() {
    if (this.options.advancedMode) {
      this.getRemoteMetas(this.options.metaCaching).subscribe(metaDoc =>
        this.metas = (!metaDoc ? {} : metaDoc.value) as DatabaseDataCollectionMetas
      );
    }
    return this as DatabaseData<Type>;
  }

  getOptions() {
    return this.options;
  }

  getLinkingFields() {
    return [...(this.options.linkingFields || []), ...this.minimumLinkingFields];
  }

  getDataPickers() {
    return this.options.effectDataPickers || {};
  }

  getRemoteMetas(caching?: false | CacheConfig) {
    return this.databaseService.get<Meta>(`metas/$${this.name}`, undefined, caching);
  }

  getMetas() {
    if (!this.options.advancedMode || !Object.keys(this.metas).length) {
      throw new Error('Metas only available when enabling "advancedMode" option with a proper setup.');
    }
    return this.metas;
  }

  getCounting(type?: string, locale?: string) {
    if (!this.options.advancedMode || !this.metas.documentCounting) {
      throw new Error('Counting only work when enabling "advancedMode" option with a proper setup.');
    }
    const { documentCounting } = this.metas;
    // all
    if (!type) {
      return documentCounting;
    }
    // by type
    else {
      // all locales
      if (!locale) {
        return documentCounting[type];
      }
      // by locale
      else {
        return documentCounting[type][locale];
      }
    }
  }

  getRemoteSearchIndexes(caching?: false | CacheConfig) {
    return this.databaseService.list<Meta>(
      'metas',
      ref => ref
        .where('master', '==', this.name)
        .where('type', '==', 'default')
        .where('group', '==', 'search_index')
        .orderBy('createdAt', 'desc')
        .limit(this.options.searchIndexingRetrievalLimit || 3),
      caching,
    );
  }

  getSearchingData() {
    if (!this.options.advancedMode || !this.defaultIndex) {
      throw new Error('Searching only available when enabling "advancedMode" option with a proper setup.');
    }
    return {
      indexingKeys: this.searchIndexingKeys,
      indexingItems: this.searchIndexingItems,
      defaultIndex: this.defaultIndex,
      contextualIndexes: this.contextualIndexes,
      lastRetrieval: this.lastSearchRetrieval,
    } as DatabaseDataSearchingData;
  }

  createSearchIndex(
    dataOptional?:
      | DatabaseDataSearchingContextualPicker
      | DatabaseDataSearchIndexingLocalItem[]
  ) {
    // new index
    const index = new Document({
      document: { index: 'content' },
      ...this.options.flexsearchOptions,
    }) as FlexsearchDocumentIndex;
    // add items
    if (dataOptional) {
      if (typeof dataOptional === 'function') {
        this.searchIndexingKeys.forEach(key => {
          if (dataOptional(this.searchIndexingItems[key])) {
            index.add(this.searchIndexingItems[key]);
          }
        });
      } else {
        dataOptional.forEach(item => index.add(item));
      }
    }
    // result
    return index;
  }

  setupSearching(noDefaultIndexing = false, bypassCaching = false) {
    if (this.defaultIndex) {
      return of(this.getSearchingData());
    }
    return this.getRemoteSearchIndexes(
      bypassCaching
        ? false
        : this.options.searchCaching !== undefined
          ? this.options.searchCaching
          : !this.databaseService.isGlobalCachingEnabled()
              ? false
              : { name: 'Search indexes of collection: ' + this.name },
    )
    .pipe(
      map(metaItems => {
        // save last retrieval
        this.lastSearchRetrieval = metaItems[metaItems.length - 1];
        // create the default index
        this.defaultIndex = this.createSearchIndex();
        // create the contextual indexes
        (this.options.predefinedSearchingContextuals || []).forEach(({name}) => {
          this.contextualIndexes[name] = this.createSearchIndex();
        });
        // process indexing items
        let indexId = 0;
        metaItems.forEach(metaItem => {
          const { items: recordItems = {} } = metaItem.value as DatabaseDataSearchIndexing;
          // sort items (createdAt - desc)
          const items = Object.keys(recordItems)
            .map(docId => ({docId, item: recordItems[docId]}))
            .sort((a, b) => a.item.createdAt < b.item.createdAt ? 1 : -1);
          // continue
          items.forEach(({docId, item}) => {
            const id = indexId++;
            // save key
            this.searchIndexingKeys[id] = docId;
            // save item
            this.searchIndexingItems[docId] =
              { id, docId, ...item } as DatabaseDataSearchIndexingLocalItem;
            // register default index
            const { status, type, locale } =  this.searchIndexingItems[docId];
            const { settingService } = this.databaseService.getIntegrations();
            if (
              !noDefaultIndexing &&
              type === 'default' &&
              status === 'publish' &&
              (!locale || !settingService || locale === settingService.locale)
            ) {
              (this.defaultIndex as FlexsearchDocumentIndex)
                .add(this.searchIndexingItems[docId]);
            }
            // register contextual indexes
            (this.options.predefinedSearchingContextuals || []).forEach(({name, picker}) => {
              if (picker(this.searchIndexingItems[docId])) {
                (this.contextualIndexes[name] as FlexsearchDocumentIndex)
                  .add(this.searchIndexingItems[docId]);
              }
            });
          });
        });
        // result
        return this.getSearchingData();
      })
    )
  }

  count(type?: string, locale?: string, status?: string) {
    const documentCounting = this.getCounting() as DatabaseDataCollectionMetaDocumentCouting;
    // all
    if (!type) {
      let count = 0;
      Object.keys(documentCounting).forEach(type =>
        Object.keys(documentCounting[type]).forEach(locale =>
          Object.keys(documentCounting[type][locale]).forEach(status =>
            count += documentCounting[type][locale][status]
          )
        )
      );
      return count;
    }
    // by type
    else {
      // all locales
      if (!locale) {
        let count = 0;
        Object.keys(documentCounting[type]).forEach(locale =>
          Object.keys(documentCounting[type][locale]).forEach(status =>
            count += documentCounting[type][locale][status]
          )
        );
        return count;
      }
      // by locale
      else {
        // all statuses
        if (!status) {
          let count = 0;
          Object.keys(documentCounting[type][locale]).forEach(status =>
            count += documentCounting[type][locale][status]
          );
          return count;
        }
        // by status
        else {
          return documentCounting[type][locale][status];
        }
      }
    }
  }

  onLinking(mode: DatabaseDataLinkingMode, item: Type): Observable<any> {
    if (!this.options.linkingHook) {
      return of(false);
    }
    return this.options.linkingHook(mode, item, this);
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

  create<AutoType extends Omit<Type, 'uid' | 'id' | 'title' | 'status' | 'type' | 'createdAt' | 'updatedAt'>>(
    id: string,
    item: Type | AutoType | NullableOptional<Type | AutoType>
  ) {
    const actions: Array<Observable<any>> = [];
    // main action
    const { settingService, userService } = this.databaseService.getIntegrations();
    const uid = (item as any).uid as string || ((!userService || !userService.uid) ? '' : userService.uid);
    const title = (item as any).title as string || id;
    const status = (item as any).status as string || 'draft';
    const type = (item as any).type as string || 'default';
    const createdAt = (item as any).createdAt as string || new Date().toISOString();
    const updatedAt = (item as any).updatedAt as string || createdAt;
    const data = {
      ...item,
      uid,
      id,
      title,
      status,
      type,
      createdAt,
      updatedAt,
    } as Type | NullableOptional<Type>;
    actions.push(
      this.databaseService.set(`${this.name}/${id}`, data)
    );
    // create metas
    if (this.options.advancedMode && this.options.docMetaRegistry) {
      actions.push(
        this.addDocMetas(id, data, this.options.docMetaRegistry)
      );
    }
    // update document count
    if (this.options.advancedMode && this.metas.documentCounting) {
      const locale = (item as any).locale as string || settingService?.locale || 'en-US';
      actions.push(
        this.databaseService.update(`metas/$${this.name}`, {
          [`value.documentCounting.${type}.${locale}.${status}`]:
            this.databaseService.getValueIncrement()
        })
        .pipe(
          tap(() => ++((this.metas.documentCounting as any)[type][locale][status]))
        )
      );
    }
    // add search indexing item
    if (this.options.advancedMode && this.metas.searchIndexing) {
      actions.push(
        this.addSearchIndexingItem(data, this.metas.searchIndexing)
      );
    }
    // run actions
    return combineLatest(actions).pipe(map(() => true));
  }

  update(
    id: string,
    data: Partial<Type> | NullableOptional<Partial<Type>>,
    currentData?: Type,
  ) {
    const actions: Array<Observable<any>> = [];
    // main action
    const updatedAt = (data as any).updatedAt as undefined | string || new Date().toISOString();
    const updateData = { ...data, updatedAt } as Partial<Type> | NullableOptional<Partial<Type>>;
    actions.push(
      this.databaseService.update(`${this.name}/${id}`, updateData)
    );
    // update count
    const newStatus = (data as any).status as undefined | string;
    if (this.options.advancedMode && this.metas.documentCounting && newStatus && currentData) {
      const type = (currentData as any).type as string;
      const locale = (
        (currentData as any).locale ||
        this.databaseService.getIntegrations().settingService?.defaultLocale ||
        'en-US'
      ) as string;
      const status = (currentData as any).status as string;
      if (newStatus !== status) {
        actions.push(
          this.databaseService.update(`metas/$${this.name}`, {
            [`value.documentCounting.${type}.${locale}.${newStatus}`]:
              this.databaseService.getValueIncrement(),
            [`value.documentCounting.${type}.${locale}.${status}`]:
              this.databaseService.getValueIncrement(-1)
          })
          .pipe(
            tap(() =>
              ++((this.metas.documentCounting as any)[type][locale][newStatus]) &&
              --((this.metas.documentCounting as any)[type][locale][status])
            )
          )
        );
      }
    }
    // update search indexing item
    if (this.options.advancedMode && this.metas.searchIndexing) {
      actions.push(this.updateSearchIndexingItem(id, updateData, currentData));
    }
    // run actions
    return combineLatest(actions).pipe(map(() => true));
  }

  updateEffects(
    id: string,
    data: Partial<Type> | NullableOptional<Partial<Type>>
  ): Observable<DatabaseDataEffectedTask> {
    // check effected
    const effectedProps = this.getLinkingFields().filter(prop => !!(data as any)[prop]);
    if (!effectedProps.length || !this.options.updateEffects?.length) {
      return of({ count: 0, percentage$: of(100) });
    }
    // get data
    const dataPickers = this.options.effectDataPickers || {};
    const effectedData = effectedProps.reduce(
      (result, prop) => {
        const value = !dataPickers[prop]
          ? (data as any)[prop]
          : dataPickers[prop]((data as any)[prop], data);
        if (value) {
          result[prop] = value;
        }
        return result;
      },
      {} as Record<string, any>,
    );
    // update all effected
    const effectedStatus = (data as any).status as undefined | string;
    const allEffects = [] as Observable<any>[];
    return combineLatest(
      this.options.updateEffects.map(({ collection: collectionName, key: effectedKey }, i) =>
        this.databaseService.collection<firebase.firestore.DocumentData>(
          collectionName,
          ref => ref.where(`${effectedKey}.${id}.id`, '==', id)
        )
        .get()
        .pipe(
          catchError(() => of({docs: [] as firebase.firestore.QueryDocumentSnapshot[]})),
          tap(result => {
            allEffects.push(
              ...result.docs.map(doc =>
                from(
                  doc.ref.update({
                    [`${effectedKey}.${id}`]:
                      (effectedStatus && effectedStatus !== 'publish')
                        ? this.databaseService.getValueDelete()
                        : effectedData,
                  })
                )
              )
            );
          }),
        )
      )
    )
    .pipe(
      map(() => {
        const count = allEffects.length;
        const percentage$ = new BehaviorSubject<number>(0);
        // run actions
        let resolvedCount = 0;
        allEffects.forEach(effected => {
          effected.pipe(
            tap(() => {
              resolvedCount++;
              percentage$.next(resolvedCount / count * 100);
            }),
          )
          .subscribe()
        });
        // return task
        return { count, percentage$ };
      }),
    );
  }

  trash(id: string, currentData?: Type) {
    return this.update(id, {status: 'trash'} as unknown as Partial<Type>, currentData);
  }

  trashEffects(id: string) {
    return this.updateEffects(id, {status: 'trash'} as unknown as Partial<Type>);
  }

  delete(id: string, currentData?: Type) {
    const actions: Array<Observable<any>> = [];
    // main action
    actions.push(
      this.databaseService.delete(`${this.name}/${id}`)
    );
    // update count
    if (this.options.advancedMode && this.metas.documentCounting && currentData) {
      const type = (currentData as any).type as string;
      const locale = (
        (currentData as any).locale ||
        this.databaseService.getIntegrations().settingService?.defaultLocale ||
        'en-US'
      ) as string;
      const status = (currentData as any).status as string;
      actions.push(
        this.databaseService.update(`metas/$${this.name}`, {
          [`value.documentCounting.${type}.${locale}.${status}`]:
            this.databaseService.getValueIncrement(-1)
        })
        .pipe(
          tap(() =>
            --((this.metas.documentCounting as any)[type][locale][status])
          ),
        )
      );
    }
    // delete search indexing item
    if (this.options.advancedMode && this.metas.searchIndexing) {
      actions.push(this.removeSearchIndexingItem(id, currentData));
    }
    // run actions
    return combineLatest(actions).pipe(map(() => true));
  }

  deleteEffects(id: string) {
    return this.trashEffects(id);
  }

  increment(id: string, data: Record<string, number>) {
    return this.databaseService.increment(`${this.name}/${id}`, data);
  }

  streamGet(idOrQuery: string | QueryFn) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.streamGet<Type>(`${this.name}/${idOrQuery}`)
      : this.databaseService.streamGet<Type>(this.name, idOrQuery);
  }

  streamList(queryFn?: QueryFn) {
    return this.databaseService.streamList<Type>(this.name, queryFn);
  }

  streamRecord(queryFn?: QueryFn) {
    return this.databaseService.streamRecord<Type>(this.name, queryFn);
  }

  flatGet(idOrQuery: string | QueryFn) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.flatGet<Type>(`${this.name}/${idOrQuery}`)
      : this.databaseService.flatGet<Type>(this.name, idOrQuery);
  }

  flatList(queryFn?: QueryFn) {
    return this.databaseService.flatList<Type>(this.name, queryFn);
  }

  flatRecord(queryFn?: QueryFn) {
    return this.databaseService.flatRecord<Type>(this.name, queryFn);
  }

  get(idOrQuery: string | QueryFn, caching?: false | CacheConfig) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.get<Type>(`${this.name}/${idOrQuery}`, undefined, caching)
      : this.databaseService.get<Type>(this.name, idOrQuery, caching);
  }

  list(queryFn?: QueryFn, caching?: false | CacheConfig) {
    return this.databaseService.list<Type>(this.name, queryFn, caching);
  }

  record(queryFn?: QueryFn, caching?: false | CacheConfig) {
    return this.databaseService.record<Type>(this.name, queryFn, caching);
  }

  cachingGet(idOrQuery: string | QueryFn, caching?: CacheConfig) {
    return typeof idOrQuery === 'string'
      ? this.databaseService.cachingGet<Type>(`${this.name}/${idOrQuery}`, undefined, caching)
      : this.databaseService.cachingGet<Type>(this.name, idOrQuery, caching);
  }

  cachingList(queryFn?: QueryFn, caching?: CacheConfig) {
    return this.databaseService.cachingList<Type>(this.name, queryFn, caching);
  }

  cachingRecord(queryFn?: QueryFn, caching?: CacheConfig) {
    return this.databaseService.cachingRecord<Type>(this.name, queryFn, caching);
  }

  getItems(ids: string[], caching?: false | CacheConfig, itemTimeout = 7000) {
    return !ids.length
      ? of([])
      : combineLatest(
        ids.map(id =>
          this.get(id, caching).pipe(
            timeout(itemTimeout),
            catchError(() => of(null)),
          )
        )
      )
      .pipe(
        map(items => items.filter(item => !!item) as Type[])
      );
  }

  lookup(
    input: DatabaseDataLookupInput,
    limit = 10,
    lastItem?: Type,
    caching: false | CacheConfig = false
  ) {
    const { keyword, type, status, locale } = input;
    return this.list(ref =>
      {
        let query = ref
          .where('type', '==', type)
          .where('status', '==', status)
          .where('keywords', 'array-contains', keyword)
          .orderBy('createdAt', 'desc');
        if (locale) {
          query = query.where('locale', '==', locale);
        }
        if (lastItem) {
          query = query.startAfter((lastItem as any).createdAt);
        }
        return query.limit(limit);
      },
      caching,
    );
  }

  search(query: string, limit = 10, context?: string | FlexsearchDocumentIndex) {
    const index = !context
      ? this.defaultIndex
      : typeof context === 'string'
      ? this.contextualIndexes[context]
      : context;
    if (!index) {
      throw new Error('No index found, please run "setupSearching()" first.');
    }
    const [contentFound] = index.search(query);
    return new DatabaseDataSearchResult<Type>(
      this,
      index,
      limit,
      !contentFound ? [] : contentFound.result,
    );
  }

  private buildSearchIndexingItem(data: any) {
    const type = data.type as string;
    const status = data.status as string;
    const createdAt = data.createdAt as string;
    const locale = data.locale as (undefined | string);
    const content = (
      ([
        data.id,
        ...(data.keywords || []),
        ...(Object.keys(data.authors || {})),
        ...(Object.keys(data.categories || {})),
        ...(Object.keys(data.tags || {})),
      ] as string[])
      .join(' ')
    )
    .replace(/\-|\_/g, ' ')
    .toLowerCase();
    // combine data
    const indexingItem = {
      content,
      type,
      status,
      createdAt,
      ...(!locale ? {} : {locale}),
      ...(
        !this.options.searchIndexingBuildItemExtender
          ? {}
          : this.options.searchIndexingBuildItemExtender(data)
      )
    };
    // check for size
    const objectLength = JSON.stringify(indexingItem).length;
    if (objectLength < 1000) {
      return indexingItem;
    } else {
      const truncateContent = content.substr(0, content.length - (objectLength - 1000));
      return { ...indexingItem, content: truncateContent };
    }
  }

  private addSearchIndexingItem(
    data: Type | NullableOptional<Type>,
    searchIndexing: DatabaseDataCollectionMetaSearchIndexing,
  ) {
    // get the current indexing id
    const { currentId, map } = searchIndexing;
    const { count, nextId } = map[currentId];
    const indexingId = count < 1000 ? currentId : nextId ? nextId: undefined; 
    // maximum reached and no next indexing found
    if (!indexingId) {
      return of([] as unknown as [void, void]);
    }
    // save item and increase the count
    const indexingItemId = (data as any).id as string;
    const indexingItem = this.buildSearchIndexingItem(data);
    return combineLatest([
      this.databaseService.update(`metas/${indexingId}`, {
        updatedAt: new Date().toISOString(),
        [`value.items.${indexingItemId}`]: indexingItem,
      }),
      this.databaseService.update(`metas/$${this.name}`, {
        [`value.searchIndexing.map.${indexingId}.count`]: this.databaseService.getValueIncrement(),
      })
      .pipe(
        tap(() => {
          (this.metas.searchIndexing as DatabaseDataCollectionMetaSearchIndexing).currentId = indexingId;
          ++((this.metas.searchIndexing as DatabaseDataCollectionMetaSearchIndexing).map[indexingId].count);
        }),
      ),
    ]);
  }

  private updateSearchIndexingItem(
    id: string,
    data: Partial<Type> | NullableOptional<Partial<Type>>,
    currentData?: Type,
  ) {
    const defaultUpdateChecker = (_data: any) => (_data.status || _data.keywords);
    const extendedUpdateChecker = this.options.searchIndexingCheckUpdateExtender ||
      ((_data: any) => false);
    // no update necessary
    if (!defaultUpdateChecker(data) && !extendedUpdateChecker(data)) {
      return of(null);
    }
    // update
    return (currentData ? of(currentData) : this.get(id))
    .pipe(
      switchMap(item => !item
        ? of([])
        : combineLatest([
          of(item),
          this.databaseService.list<Meta>(
            'metas',
            ref => ref
              .where('master', '==', this.name)
              .where('type', '==', 'default')
              .where('group', '==', 'search_index')
              .where('createdAt', '<=', (item as any).createdAt)
              .orderBy('createdAt', 'desc')
              .limit(1),
            false
          )
          .pipe(
            map(metaDocs => metaDocs[0]),
          )
        ])
      ),
      switchMap(([item, metaDoc]) => !item || !metaDoc
        ? of(null) // something went wrong
        : this.databaseService.update(
            `metas/${metaDoc.id}`,
            {
              updatedAt: new Date().toISOString(),
              [`value.items.${id}`]: this.buildSearchIndexingItem({...item, ...data}),
            }
          )
      )
    );
  }

  private removeSearchIndexingItem(id: string, currentData?: Type) {
    return (currentData ? of(currentData) : this.get(id))
    .pipe(
      switchMap(item => !item
        ? of(undefined)
        : this.databaseService.list<Meta>(
          'metas',
          ref => ref
            .where('master', '==', this.name)
            .where('type', '==', 'default')
            .where('group', '==', 'search_index')
            .where('createdAt', '<=', (item as any).createdAt)
            .orderBy('createdAt', 'desc')
            .limit(1),
          false
        )
        .pipe(
          map(metaDocs => metaDocs[0]),
        )
      ),
      switchMap(metaDoc => !metaDoc
        ? of(null) // something went wrong
        : combineLatest([
          this.databaseService.update(
            `metas/${metaDoc.id}`,
            {
              updatedAt: new Date().toISOString(),
              [`value.items.${id}`]: this.databaseService.getValueDelete(),
            }
          ),
          this.databaseService.update(`metas/$${this.name}`, {
            [`value.searchIndexing.map.${metaDoc.id}.count`]: this.databaseService.getValueIncrement(-1),
          })
          .pipe(
            tap(() => {
              --((this.metas.searchIndexing as DatabaseDataCollectionMetaSearchIndexing).map[metaDoc.id].count);
            }),
          ),
        ])
      ),
    );
  }

  private addDocMetas(
    id: string,
    docData: Type | NullableOptional<Type>,
    docMetaRegistry: Record<string, DatabaseDataItemMetaRegistry>
  ) {
    const actions: Array<Observable<any>> = Object.keys(docMetaRegistry).map(metaName => {
      const {
        group: metaGroup,
        valueBuilder: metaValueBuilder,
      } = docMetaRegistry[metaName];
      const { userService } = this.databaseService.getIntegrations();
      const uid = ((!userService || !userService.uid) ? '' : userService.uid);
      const metaId = `${id}_${this.name}_${metaName}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      const selfData: Meta = {
        uid,
        id: metaId,
        title: id,
        type: 'default',
        status: 'publish',
        createdAt,
        updatedAt,
        master: `${this.name}#${id}`,
        group: metaGroup,
        value: null,
      };
      return metaValueBuilder(id, docData, selfData).pipe(
        switchMap(metaValue => {
          return this.databaseService.set(`metas/${id}`, { ...selfData, value: metaValue });
        }),
      );
    });
    return combineLatest(actions);
  }

}

/*
 * ====================================================================================
 * ========================= DATABASE DATA SEARCH RESULT ==============================
 * ==================================================================================== 
 */

export class DatabaseDataSearchResult<Type> {
  private indexingKeys: string[];

  constructor(
    private dataService: DatabaseData<Type>,
    private index: FlexsearchDocumentIndex,
    private limit: number,
    private searchResult: number[],
  ) {
    const { indexingKeys } = this.dataService.getSearchingData();
    this.indexingKeys = indexingKeys;
  }

  count() {
    return this.searchResult.length;
  }

  list(page = 1, itemCaching?: false | CacheConfig, itemTimeout = 7000) {
    const offset = (page - 1) * this.limit;
    const ids = this.searchResult.slice(offset, offset + this.limit);
    return this.dataService.getItems(ids.map(id => this.indexingKeys[id]), itemCaching, itemTimeout);
  }
}
