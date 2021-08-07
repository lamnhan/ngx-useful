import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import firebase from 'firebase/app';
import { from, Observable } from 'rxjs';
import Compressor from 'compressorjs';

export type VendorStorageService = AngularFireStorage;

export interface StorageOptions {
  driver?: string;
  uploadFolder?: string;
  dateGrouping?: boolean;
  randomSuffix?: boolean;
}

export interface UploadCustom {
  uploadFolder?: string;
  noDateGrouping?: boolean;
  noRandomSuffix?: boolean;
  metadata?: firebase.storage.UploadMetadata;
}

export interface StorageItem {
  ref: AngularFireStorageReference;
  name: string;
  type: 'image' | 'audio' | 'video' | 'document' | 'archive' | 'unknown';
  fullPath: string;
  downloadUrl$: Observable<string>;
  metadata$: Observable<any>;
}

export interface ResourceAlike {
  name: string;
  src: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private options: StorageOptions = {};
  private service!: VendorStorageService;
  driver = 'firebase';
  defaultFolder = 'app-content/uploads';

  constructor() {}

  setOptions(options: StorageOptions) {
    this.options = options;
    if (options.driver) {
      this.driver = options.driver;
    }
    return this as StorageService;
  }

  init(vendorService: VendorStorageService) {
    this.service = vendorService;
    return this as StorageService;
  }

  ref(fullPath: string) {
    return this.service.ref(fullPath);
  }

  list(folder?: string) {
    return this.ref(this.getUploadFolder(folder)).listAll();
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

  getUploadFolder(customFolder?: string) {
    return customFolder || this.options.uploadFolder || this.defaultFolder;
  }

  buildStorageItem(fullPath: string): StorageItem {
    const ref = this.ref(fullPath);
    return {
      ref,
      name: this.getFileName(fullPath),
      fullPath,
      type: this.getFileType(fullPath),
      downloadUrl$: ref.getDownloadURL(),
      metadata$: ref.getMetadata(),
    };
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
      cacheControl: 'private, max-age=2628000',
      customMetadata: {},
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

  private getFileType(fullPath: string) {
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
}
