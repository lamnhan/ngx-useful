// @ts-ignore
import { Index } from 'flexsearch';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import { from, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import Compressor from 'compressorjs';

import { HelperService } from '../helper/helper.service';
import { CacheService, CacheConfig } from '../cache/cache.service';

export type VendorStorageService = AngularFireStorage;

export interface StorageOptions {
  driver?: string;
  uploadFolder?: string;
  cacheControl?: string;
  customMetadata?: Record<string, any>;
  dateGrouping?: boolean;
  randomSuffix?: boolean;
  listingCacheTime?: number;
  listingIgnoreEmptyFolder?: boolean;
  flexsearchOptions?: any;
}

export interface StorageIntegrations {
  cacheService?: CacheService;
}

export interface UploadCustom {
  uploadFolder?: string;
  noDateGrouping?: boolean;
  noRandomSuffix?: boolean;
  metadata?: firebase.storage.UploadMetadata;
}

export interface ResourceAlike {
  name: string;
  src: string;
}

export type StorageItemType = 'image' | 'audio' | 'video' | 'document' | 'archive' | 'unknown';

export interface StorageItem {
  name: string;
  type: StorageItemType;
  fullPath: string;
  downloadUrl: string;
  metadata: any;
}

export interface StorageListResult {
  folders: string[];
  files: string[];
}

export interface FlexsearchIndex {
  add: (id: number, content: string) => any;
  search: (query: string, ...args: any[]) => number[];
}

export interface StorageSearchingData {
  index: FlexsearchIndex;
  indexingKeys: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private options: StorageOptions = {};
  private integrations: StorageIntegrations = {};
  private service!: VendorStorageService;
  driver = 'firebase';

  public readonly defaultFolder = 'app-content/uploads';

  constructor(private helperService: HelperService) {}

  setOptions(options: StorageOptions) {
    this.options = options;
    if (options.driver) {
      this.driver = options.driver;
    }
    return this as StorageService;
  }

  setIntegrations(integrations: StorageIntegrations) {
    this.integrations = integrations;
    return this as StorageService;
  }

  init(vendorService: VendorStorageService) {
    this.service = vendorService;
    return this as StorageService;
  }

  getUploadFolder(customFolder?: string) {
    return customFolder || this.options.uploadFolder || this.defaultFolder;
  }

  ref(fullPath: string) {
    return this.service.ref(fullPath);
  }
  
  delete(fullPath: string) {
    return this.ref(fullPath).delete();
  }

  upload(path: string, data: File | Blob, custom: UploadCustom = {}) {
    const { fileName, fullPath, metadata } = this.extractUploadInputs(path, custom);
    const ref = this.ref(fullPath);
    const task = ref.put(data, metadata);
    return { name: fileName, fullPath, ref, task };
  }

  uploadFile(path: string, file: File, custom: UploadCustom = {}) {
    return this.upload(path, file, custom);
  }

  uploadBlob(path: string, blob: Blob, custom: UploadCustom = {}) {
    return this.upload(path, blob, custom);
  }

  vendorList(customFolder?: string) {
    return this.ref(this.getUploadFolder(customFolder)).listAll();
  }

  list(caching?: false | CacheConfig, customFolder?: string): Observable<StorageListResult> {
    const topFolder = this.getUploadFolder(customFolder);
    // action
    const action = this.vendorList(topFolder).pipe(
      map(listResult =>
        ({
          folders: listResult.prefixes.map(item => item.fullPath),
          files: listResult.items.map(item => item.fullPath),
        })
      ),
    );
    // result
    const cacheTime = this.getCacheTime(caching);
    return !cacheTime
      ? action
      : (this.integrations.cacheService as CacheService).get(
        `storage/list/${this.helperService.md5(topFolder)}`,
        action,
        cacheTime,
      ) as Observable<StorageListResult>;
  }

  listDeep(caching?: false | CacheConfig, customFolder?: string) {
    const topFolder = this.getUploadFolder(customFolder);
    // action
    const action = new Observable<StorageListResult>(observer => {
      const allFolders = [] as string[];
      const allFiles = [] as string[];
      // lister
      const tracker = {} as Record<string, boolean>;
      const deepLister = (path: string) => {
        // set tracker
        tracker[path] = true;
        // list the path
        this.list(caching, path).subscribe(({ folders: childFolders, files: childFiles }) => {
          // further processing (if there are child folders)
          childFolders.forEach(childFolder => deepLister(childFolder));
          // resolve tracker
          delete tracker[path];
          // save the folder and its files
          if (childFiles.length || (!childFiles.length && !this.options.listingIgnoreEmptyFolder)) {
            allFolders.push(path);
          }
          allFiles.push(...childFiles);
          // done
          if (!childFolders.length && !Object.keys(tracker).length) {
            observer.next({ folders: allFolders, files: allFiles });
            observer.complete();
          }
        });
      }
      // run action
      deepLister(topFolder);
    });
    // result
    const cacheTime = this.getCacheTime(caching);
    return !cacheTime
      ? action
      : (this.integrations.cacheService as CacheService).get(
        `storage/list/${this.helperService.md5(`deep:${topFolder}`)}`,
        action,
        cacheTime,
      ) as Observable<StorageListResult>;
  }

  listFolders(caching?: false | CacheConfig, customFolder?: string) {
    return this.list(caching, customFolder).pipe(
      map(result => result.folders),
    );
  }

  listDeepFolders(caching?: false | CacheConfig, customFolder?: string) {
    return this.listDeep(caching, customFolder).pipe(
      map(result => result.folders),
    );
  }

  listFiles(caching?: false | CacheConfig, customFolder?: string) {
    return this.list(caching, customFolder).pipe(
      switchMap(result =>
        !result.files.length
          ? of([] as StorageItem[])
          : combineLatest(result.files.map(item => this.buildStorageItem(item)))
      ),
    );
  }

  listDeepFiles(caching?: false | CacheConfig, customFolder?: string) {
    return this.listDeep(caching, customFolder).pipe(
      switchMap(result =>
        !result.files.length
          ? of([] as StorageItem[])
          : combineLatest(result.files.map(item => this.buildStorageItem(item)))
      ),
    );
  }

  getFiles(fullPaths: string[], caching?: false | CacheConfig) {
    // action
    const action = !fullPaths.length
      ? of([])
      : combineLatest(fullPaths.map(fullPath => this.buildStorageItem(fullPath)));
    // result
    const cacheTime = this.getCacheTime(caching);
    return !cacheTime
      ? action
      : (this.integrations.cacheService as CacheService).get(
        `storage/list/${this.helperService.md5(fullPaths.join(','))}`,
        action,
        cacheTime,
      ) as Observable<StorageItem[]>;
  }

  searchFiles(
    searchingData: StorageSearchingData,
    query: string,
    limit = 10,
    caching: false | CacheConfig = false
  ) {
    const searchResult = searchingData.index.search(query);
    return new StorageSearchResult(
      this,
      searchingData.index,
      limit,
      searchResult,
      searchingData.indexingKeys,
      caching,
    );
  }

  getSearching(caching?: false | CacheConfig, customFolder?: string): Observable<StorageSearchingData> {
    return this.listDeep(caching, customFolder).pipe(
      map(({ files }) => {
        const index = new Index(this.options.flexsearchOptions) as FlexsearchIndex;
        files.forEach((fullPath, id) => {
          const content =
            ((fullPath.split('/').pop() as string).split('.').shift() as string)
            .replace(/\-|\_/g, ' ');
          index.add(id, content);
        });
        return { index, indexingKeys: files };
      }),
    );
  }

  buildStorageItem(fullPath: string): Observable<StorageItem> {
    const ref = this.ref(fullPath);
    const info = {
      name: this.getFileName(fullPath),
      type: this.getFileType(fullPath),
      fullPath,
    };
    return combineLatest([
      ref.getDownloadURL(),
      ref.getMetadata(),
    ])
    .pipe(
      map(([downloadUrl, metadata]) =>
        ({ ...info, downloadUrl, metadata })
      )
    );
  }

  readFileDataUrl(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        observer.next(e.target.result);
        observer.complete();
      }
      reader.readAsDataURL(file);
    });
  }

  compressImage(input: File | Blob, options: Compressor.Options = {}) {
    const compress = new Promise<Blob>((resolve, reject) => new Compressor(
      input,
      {
        ...({
          quality: 0.6,
          mimeType: 'auto',
          ...options,
        }),
        success: data => resolve(data),
        error: err => reject(err),
      }
    ));
    return from(compress);
  }

  private extractUploadInputs(path: string, custom: UploadCustom = {}) {
    const {uploadFolder, noDateGrouping, noRandomSuffix } = custom;
    // add random suffix to avoid overwriting
    if (!noRandomSuffix && this.options.randomSuffix) {
      const randomSuffix = Math.random().toString(36).substring(7);
      const ext = path.indexOf('.') === -1 ? null : path.split('.').pop() as string;
      path = !ext
        ? `${path}-${randomSuffix}`
        : path.replace(`.${ext}`, `-${randomSuffix}.${ext}`);
    }
    // upload file to firebase storage
    const fullPath =
      (this.getUploadFolder(uploadFolder)) + '/' +
      (noDateGrouping || !this.options.dateGrouping ? '' : (this.getDateGroupingPath() + '/')) +
      path;
    const fileName = fullPath.split('/').pop() as string;
    // default metadata
    let metadata = {
      cacheControl: this.options.cacheControl || 'private, max-age=2628000',
      customMetadata: this.options.customMetadata || {},
      ...(custom.metadata || {}),
    };
    // result
    return { fileName, fullPath, metadata };
  }

  private getDateGroupingPath() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return year + '/' + (month >= 10 ? month : `0${month}`);
  }

  private getFileName(fullPath: string) {
    return fullPath.split('/').pop() as string;
  }

  private getFileType(fullPath: string): StorageItemType {
    const ext = fullPath.split('.').pop() as string;
    const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'wma', 'm4a'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'mpg', 'mpeg', '3gp', 'mkv'];
    const documentTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'html', 'csv', 'xml', 'json'];
    const archiveTypes = ['zip', 'rar', 'tar', 'gz', '7z', 'bz2'];
    return (imageTypes.indexOf(ext) > -1) ? 'image' :
      (audioTypes.indexOf(ext) > -1) ? 'audio' :
      (videoTypes.indexOf(ext) > -1) ? 'video' :
      (documentTypes.indexOf(ext) > -1) ? 'document' :
      (archiveTypes.indexOf(ext) > -1) ? 'archive' :
      'unknown';
  }

  private getCacheTime(caching?: false | CacheConfig) {
    return (!this.integrations.cacheService || caching === false)
      ? 0
      : caching?.time || this.options.listingCacheTime || 0;
  }
}

export class StorageSearchResult {
  constructor(
    private storageService: StorageService,
    private index: FlexsearchIndex,
    private limit: number,
    private searchResult: number[],
    private indexingKeys: string[],
    private caching: false | CacheConfig,
  ) {}

  count() {
    return this.searchResult.length;
  }

  list(page = 1) {
    const offset = (page - 1) * this.limit;
    const ids = this.searchResult.slice(offset, offset + this.limit);
    return this.storageService.getFiles(ids.map(id => this.indexingKeys[id]), this.caching);
  }
}
