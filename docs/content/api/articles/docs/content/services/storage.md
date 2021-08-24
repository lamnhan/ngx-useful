<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="storageservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html"><p>The <code>StorageService</code> class</p>
</a></h2>

**The `StorageService` class.**

<h3><a name="storageservice-properties"><p>StorageService properties</p>
</a></h3>

| Name                                                                                                        | Type                               | Description |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------- |
| [defaultFolder](https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#defaultfolder) | <code>"app-content/uploads"</code> |             |
| [driver](https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#driver)               | <code>string</code>                |             |

<h3><a name="storageservice-methods"><p>StorageService methods</p>
</a></h3>

| Function                                                                             | Returns type                                                                                                                                     | Description |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [buildStorageItem(fullPath)](#storageservice-buildstorageitem-0)                     | <code>Observable<StorageItem></code>                                                                                                             |             |
| [compressImage(input, options?)](#storageservice-compressimage-0)                    | <code>Observable<Blob></code>                                                                                                                    |             |
| [delete(fullPath)](#storageservice-delete-0)                                         | <code>Observable<any></code>                                                                                                                     |             |
| [getFiles(fullPaths, caching?)](#storageservice-getfiles-0)                          | <code>Observable<StorageItem[]></code>                                                                                                           |             |
| [getSearching(caching?, customFolder?)](#storageservice-getsearching-0)              | <code>Observable<StorageSearchingData></code>                                                                                                    |             |
| [getUploadFolder(customFolder?)](#storageservice-getuploadfolder-0)                  | <code>string</code>                                                                                                                              |             |
| [init(vendorService)](#storageservice-init-0)                                        | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html" target="_blank">StorageService</a></code>           |             |
| [list(caching?, customFolder?)](#storageservice-list-0)                              | <code>Observable<StorageListResult></code>                                                                                                       |             |
| [listDeep(caching?, customFolder?)](#storageservice-listdeep-0)                      | <code>Observable<StorageListResult></code>                                                                                                       |             |
| [listDeepFiles(caching?, customFolder?)](#storageservice-listdeepfiles-0)            | <code>Observable<StorageItem[]></code>                                                                                                           |             |
| [listDeepFolders(caching?, customFolder?)](#storageservice-listdeepfolders-0)        | <code>Observable<string[]></code>                                                                                                                |             |
| [listFiles(caching?, customFolder?)](#storageservice-listfiles-0)                    | <code>Observable<StorageItem[]></code>                                                                                                           |             |
| [listFolders(caching?, customFolder?)](#storageservice-listfolders-0)                | <code>Observable<string[]></code>                                                                                                                |             |
| [readFileDataUrl(file)](#storageservice-readfiledataurl-0)                           | <code>Observable<string></code>                                                                                                                  |             |
| [ref(fullPath)](#storageservice-ref-0)                                               | <code>AngularFireStorageReference</code>                                                                                                         |             |
| [searchFiles(searchingData, query, limit?, caching?)](#storageservice-searchfiles-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storagesearchresult.html" target="_blank">StorageSearchResult</a></code> |             |
| [setIntegrations(integrations)](#storageservice-setintegrations-0)                   | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html" target="_blank">StorageService</a></code>           |             |
| [setOptions(options)](#storageservice-setoptions-0)                                  | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html" target="_blank">StorageService</a></code>           |             |
| [upload(path, data, custom?)](#storageservice-upload-0)                              | <code>object</code>                                                                                                                              |             |
| [uploadBlob(path, blob, custom?)](#storageservice-uploadblob-0)                      | <code>object</code>                                                                                                                              |             |
| [uploadFile(path, file, custom?)](#storageservice-uploadfile-0)                      | <code>object</code>                                                                                                                              |             |
| [vendorList(customFolder?)](#storageservice-vendorlist-0)                            | <code>Observable<ListResult></code>                                                                                                              |             |

<h4><a name="storageservice-buildstorageitem-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#buildstorageitem"><p><code>buildStorageItem(fullPath)</code></p>
</a></h4>

**The `buildStorageItem` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **fullPath** | <code>string</code> |             |

**Returns**

<code>Observable<StorageItem></code>

---

<h4><a name="storageservice-compressimage-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#compressimage"><p><code>compressImage(input, options?)</code></p>
</a></h4>

**The `compressImage` call signature.**

**Parameters**

| Param     | Type                      | Description |
| --------- | ------------------------- | ----------- |
| **input** | <code>File \| Blob</code> |             |
| options   | <code>Options</code>      |             |

**Returns**

<code>Observable<Blob></code>

---

<h4><a name="storageservice-delete-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#delete"><p><code>delete(fullPath)</code></p>
</a></h4>

**The `delete` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **fullPath** | <code>string</code> |             |

**Returns**

<code>Observable<any></code>

---

<h4><a name="storageservice-getfiles-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#getfiles"><p><code>getFiles(fullPaths, caching?)</code></p>
</a></h4>

**The `getFiles` call signature.**

**Parameters**

| Param         | Type                                                                                                                                         | Description |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **fullPaths** | <code>string[]</code>                                                                                                                        |             |
| caching       | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code>Observable<StorageItem[]></code>

---

<h4><a name="storageservice-getsearching-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#getsearching"><p><code>getSearching(caching?, customFolder?)</code></p>
</a></h4>

**The `getSearching` call signature.**

**Parameters**

| Param        | Type                                                                                                                                         | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| caching      | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |
| customFolder | <code>undefined \| string</code>                                                                                                             |             |

**Returns**

<code>Observable<StorageSearchingData></code>

---

<h4><a name="storageservice-getuploadfolder-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#getuploadfolder"><p><code>getUploadFolder(customFolder?)</code></p>
</a></h4>

**The `getUploadFolder` call signature.**

**Parameters**

| Param        | Type                             | Description |
| ------------ | -------------------------------- | ----------- |
| customFolder | <code>undefined \| string</code> |             |

**Returns**

<code>string</code>

---

<h4><a name="storageservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#init"><p><code>init(vendorService)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param             | Type                                                                                                                                               | Description |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **vendorService** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#vendorstorageservice" target="_blank">VendorStorageService</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html" target="_blank">StorageService</a></code>

---

<h4><a name="storageservice-list-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#list"><p><code>list(caching?, customFolder?)</code></p>
</a></h4>

**The `list` call signature.**

**Parameters**

| Param        | Type                                                                                                                                         | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| caching      | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |
| customFolder | <code>undefined \| string</code>                                                                                                             |             |

**Returns**

<code>Observable<StorageListResult></code>

---

<h4><a name="storageservice-listdeep-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#listdeep"><p><code>listDeep(caching?, customFolder?)</code></p>
</a></h4>

**The `listDeep` call signature.**

**Parameters**

| Param        | Type                                                                                                                                         | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| caching      | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |
| customFolder | <code>undefined \| string</code>                                                                                                             |             |

**Returns**

<code>Observable<StorageListResult></code>

---

<h4><a name="storageservice-listdeepfiles-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#listdeepfiles"><p><code>listDeepFiles(caching?, customFolder?)</code></p>
</a></h4>

**The `listDeepFiles` call signature.**

**Parameters**

| Param        | Type                                                                                                                                         | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| caching      | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |
| customFolder | <code>undefined \| string</code>                                                                                                             |             |

**Returns**

<code>Observable<StorageItem[]></code>

---

<h4><a name="storageservice-listdeepfolders-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#listdeepfolders"><p><code>listDeepFolders(caching?, customFolder?)</code></p>
</a></h4>

**The `listDeepFolders` call signature.**

**Parameters**

| Param        | Type                                                                                                                                         | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| caching      | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |
| customFolder | <code>undefined \| string</code>                                                                                                             |             |

**Returns**

<code>Observable<string[]></code>

---

<h4><a name="storageservice-listfiles-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#listfiles"><p><code>listFiles(caching?, customFolder?)</code></p>
</a></h4>

**The `listFiles` call signature.**

**Parameters**

| Param        | Type                                                                                                                                         | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| caching      | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |
| customFolder | <code>undefined \| string</code>                                                                                                             |             |

**Returns**

<code>Observable<StorageItem[]></code>

---

<h4><a name="storageservice-listfolders-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#listfolders"><p><code>listFolders(caching?, customFolder?)</code></p>
</a></h4>

**The `listFolders` call signature.**

**Parameters**

| Param        | Type                                                                                                                                         | Description |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| caching      | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |
| customFolder | <code>undefined \| string</code>                                                                                                             |             |

**Returns**

<code>Observable<string[]></code>

---

<h4><a name="storageservice-readfiledataurl-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#readfiledataurl"><p><code>readFileDataUrl(file)</code></p>
</a></h4>

**The `readFileDataUrl` call signature.**

**Parameters**

| Param    | Type              | Description |
| -------- | ----------------- | ----------- |
| **file** | <code>File</code> |             |

**Returns**

<code>Observable<string></code>

---

<h4><a name="storageservice-ref-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#ref"><p><code>ref(fullPath)</code></p>
</a></h4>

**The `ref` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **fullPath** | <code>string</code> |             |

**Returns**

<code>AngularFireStorageReference</code>

---

<h4><a name="storageservice-searchfiles-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#searchfiles"><p><code>searchFiles(searchingData, query, limit?, caching?)</code></p>
</a></h4>

**The `searchFiles` call signature.**

**Parameters**

| Param             | Type                                                                                                                                                  | Description |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **searchingData** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/storagesearchingdata.html" target="_blank">StorageSearchingData</a></code> |             |
| **query**         | <code>string</code>                                                                                                                                   |             |
| limit             | <code>number</code>                                                                                                                                   |             |
| caching           | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code>          |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storagesearchresult.html" target="_blank">StorageSearchResult</a></code>

---

<h4><a name="storageservice-setintegrations-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#setintegrations"><p><code>setIntegrations(integrations)</code></p>
</a></h4>

**The `setIntegrations` call signature.**

**Parameters**

| Param            | Type                                                                                                                                                | Description |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **integrations** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/storageintegrations.html" target="_blank">StorageIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html" target="_blank">StorageService</a></code>

---

<h4><a name="storageservice-setoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#setoptions"><p><code>setOptions(options)</code></p>
</a></h4>

**The `setOptions` call signature.**

**Parameters**

| Param       | Type                                                                                                                                      | Description |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **options** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/storageoptions.html" target="_blank">StorageOptions</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html" target="_blank">StorageService</a></code>

---

<h4><a name="storageservice-upload-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#upload"><p><code>upload(path, data, custom?)</code></p>
</a></h4>

**The `upload` call signature.**

**Parameters**

| Param    | Type                                                                                                                                  | Description |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                   |             |
| **data** | <code>File \| Blob</code>                                                                                                             |             |
| custom   | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/uploadcustom.html" target="_blank">UploadCustom</a></code> |             |

**Returns**

<code>object</code>

---

<h4><a name="storageservice-uploadblob-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#uploadblob"><p><code>uploadBlob(path, blob, custom?)</code></p>
</a></h4>

**The `uploadBlob` call signature.**

**Parameters**

| Param    | Type                                                                                                                                  | Description |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                   |             |
| **blob** | <code>Blob</code>                                                                                                                     |             |
| custom   | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/uploadcustom.html" target="_blank">UploadCustom</a></code> |             |

**Returns**

<code>object</code>

---

<h4><a name="storageservice-uploadfile-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#uploadfile"><p><code>uploadFile(path, file, custom?)</code></p>
</a></h4>

**The `uploadFile` call signature.**

**Parameters**

| Param    | Type                                                                                                                                  | Description |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                   |             |
| **file** | <code>File</code>                                                                                                                     |             |
| custom   | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/uploadcustom.html" target="_blank">UploadCustom</a></code> |             |

**Returns**

<code>object</code>

---

<h4><a name="storageservice-vendorlist-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/storageservice.html#vendorlist"><p><code>vendorList(customFolder?)</code></p>
</a></h4>

**The `vendorList` call signature.**

**Parameters**

| Param        | Type                             | Description |
| ------------ | -------------------------------- | ----------- |
| customFolder | <code>undefined \| string</code> |             |

**Returns**

<code>Observable<ListResult></code>

---

</section>
