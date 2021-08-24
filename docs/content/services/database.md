<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="databaseservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html"><p>The <code>DatabaseService</code> class</p>
</a></h2>

**The `DatabaseService` class.**

<h3><a name="databaseservice-properties"><p>DatabaseService properties</p>
</a></h3>

| Name                                                                                           | Type                | Description |
| ---------------------------------------------------------------------------------------------- | ------------------- | ----------- |
| [driver](https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#driver) | <code>string</code> |             |

<h3><a name="databaseservice-methods"><p>DatabaseService methods</p>
</a></h3>

| Function                                                                    | Returns type                                                                                                                                          | Description |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [cachingGet(path, queryFn?, caching?)](#databaseservice-cachingget-0)       | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>                              |             |
| [cachingList(path, queryFn?, caching?)](#databaseservice-cachinglist-0)     | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>                              |             |
| [cachingRecord(path, queryFn?, caching?)](#databaseservice-cachingrecord-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>                              |             |
| [collection(path, queryFn?)](#databaseservice-collection-0)                 | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#databasecollection" target="_blank">DatabaseCollection</a></code>        |             |
| [createId()](#databaseservice-createid-0)                                   | <code>string</code>                                                                                                                                   |             |
| [delete(path)](#databaseservice-delete-0)                                   | <code>Observable<void></code>                                                                                                                         |             |
| [doc(path)](#databaseservice-doc-0)                                         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#databaseitem" target="_blank">DatabaseItem</a></code>                    |             |
| [exists(path, queryFn?)](#databaseservice-exists-0)                         | <code>Observable<boolean></code>                                                                                                                      |             |
| [flatGet(path, queryFn?)](#databaseservice-flatget-0)                       | <code>Observable<null \| Type></code>                                                                                                                 |             |
| [flatList(path, queryFn?)](#databaseservice-flatlist-0)                     | <code>Observable<Type[]></code>                                                                                                                       |             |
| [flatRecord(path, queryFn?)](#databaseservice-flatrecord-0)                 | <code>Observable<Record<string, Type>></code>                                                                                                         |             |
| [get(path, queryFn?, caching?)](#databaseservice-get-0)                     | <code>Observable<null \| Type></code>                                                                                                                 |             |
| [getIntegrations()](#databaseservice-getintegrations-0)                     | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseintegrations.html" target="_blank">DatabaseIntegrations</a></code> |             |
| [getOptions()](#databaseservice-getoptions-0)                               | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseoptions.html" target="_blank">DatabaseOptions</a></code>           |             |
| [getValueDelete()](#databaseservice-getvaluedelete-0)                       | <code>FieldValue<></code>                                                                                                                             |             |
| [getValueIncrement(by?)](#databaseservice-getvalueincrement-0)              | <code>FieldValue<></code>                                                                                                                             |             |
| [getVendorService()](#databaseservice-getvendorservice-0)                   | <code>AngularFirestore<></code>                                                                                                                       |             |
| [increment(path, data)](#databaseservice-increment-0)                       | <code>Observable<void></code>                                                                                                                         |             |
| [init(vendorService)](#databaseservice-init-0)                              | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>              |             |
| [isGlobalCachingEnabled()](#databaseservice-isglobalcachingenabled-0)       | <code>boolean</code>                                                                                                                                  |             |
| [isTypeDelete(value)](#databaseservice-istypedelete-0)                      | <code>boolean</code>                                                                                                                                  |             |
| [isTypeIncrement(value)](#databaseservice-istypeincrement-0)                | <code>boolean</code>                                                                                                                                  |             |
| [list(path, queryFn?, caching?)](#databaseservice-list-0)                   | <code>Observable<Type[]></code>                                                                                                                       |             |
| [record(path, queryFn?, caching?)](#databaseservice-record-0)               | <code>Observable<Record<string, Type>></code>                                                                                                         |             |
| [set(path, item)](#databaseservice-set-0)                                   | <code>Observable<void></code>                                                                                                                         |             |
| [setIntegrations(integrations)](#databaseservice-setintegrations-0)         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>              |             |
| [setOptions(options)](#databaseservice-setoptions-0)                        | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>              |             |
| [streamGet(path, queryFn?)](#databaseservice-streamget-0)                   | <code>Observable<null \| Type></code>                                                                                                                 |             |
| [streamList(path, queryFn?)](#databaseservice-streamlist-0)                 | <code>Observable<Type[]></code>                                                                                                                       |             |
| [streamRecord(path, queryFn?)](#databaseservice-streamrecord-0)             | <code>Observable<Record<string, Type>></code>                                                                                                         |             |
| [update(path, item)](#databaseservice-update-0)                             | <code>Observable<void></code>                                                                                                                         |             |

<h4><a name="databaseservice-cachingget-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#cachingget"><p><code>cachingGet(path, queryFn?, caching?)</code></p>
</a></h4>

**The `cachingGet` call signature.**

**Parameters**

| Param    | Type                                                                                                                                | Description |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                 |             |
| queryFn  | <code>QueryFn</code>                                                                                                                |             |
| caching  | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>

---

<h4><a name="databaseservice-cachinglist-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#cachinglist"><p><code>cachingList(path, queryFn?, caching?)</code></p>
</a></h4>

**The `cachingList` call signature.**

**Parameters**

| Param    | Type                                                                                                                                | Description |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                 |             |
| queryFn  | <code>QueryFn</code>                                                                                                                |             |
| caching  | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>

---

<h4><a name="databaseservice-cachingrecord-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#cachingrecord"><p><code>cachingRecord(path, queryFn?, caching?)</code></p>
</a></h4>

**The `cachingRecord` call signature.**

**Parameters**

| Param    | Type                                                                                                                                | Description |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                 |             |
| queryFn  | <code>QueryFn</code>                                                                                                                |             |
| caching  | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>

---

<h4><a name="databaseservice-collection-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#collection"><p><code>collection(path, queryFn?)</code></p>
</a></h4>

**The `collection` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#databasecollection" target="_blank">DatabaseCollection</a></code>

---

<h4><a name="databaseservice-createid-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#createid"><p><code>createId()</code></p>
</a></h4>

**The `createId` call signature.**

**Returns**

<code>string</code>

---

<h4><a name="databaseservice-delete-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#delete"><p><code>delete(path)</code></p>
</a></h4>

**The `delete` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **path** | <code>string</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="databaseservice-doc-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#doc"><p><code>doc(path)</code></p>
</a></h4>

**The `doc` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **path** | <code>string</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#databaseitem" target="_blank">DatabaseItem</a></code>

---

<h4><a name="databaseservice-exists-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#exists"><p><code>exists(path, queryFn?)</code></p>
</a></h4>

**The `exists` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<boolean></code>

---

<h4><a name="databaseservice-flatget-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#flatget"><p><code>flatGet(path, queryFn?)</code></p>
</a></h4>

**The `flatGet` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<null | Type></code>

---

<h4><a name="databaseservice-flatlist-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#flatlist"><p><code>flatList(path, queryFn?)</code></p>
</a></h4>

**The `flatList` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<Type[]></code>

---

<h4><a name="databaseservice-flatrecord-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#flatrecord"><p><code>flatRecord(path, queryFn?)</code></p>
</a></h4>

**The `flatRecord` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<Record<string, Type>></code>

---

<h4><a name="databaseservice-get-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#get"><p><code>get(path, queryFn?, caching?)</code></p>
</a></h4>

**The `get` call signature.**

**Parameters**

| Param    | Type                                                                                                                                         | Description |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                          |             |
| queryFn  | <code>QueryFn</code>                                                                                                                         |             |
| caching  | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code>Observable<null | Type></code>

---

<h4><a name="databaseservice-getintegrations-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getintegrations"><p><code>getIntegrations()</code></p>
</a></h4>

**The `getIntegrations` call signature.**

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseintegrations.html" target="_blank">DatabaseIntegrations</a></code>

---

<h4><a name="databaseservice-getoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getoptions"><p><code>getOptions()</code></p>
</a></h4>

**The `getOptions` call signature.**

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseoptions.html" target="_blank">DatabaseOptions</a></code>

---

<h4><a name="databaseservice-getvaluedelete-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getvaluedelete"><p><code>getValueDelete()</code></p>
</a></h4>

**The `getValueDelete` call signature.**

**Returns**

<code>FieldValue<></code>

---

<h4><a name="databaseservice-getvalueincrement-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getvalueincrement"><p><code>getValueIncrement(by?)</code></p>
</a></h4>

**The `getValueIncrement` call signature.**

**Parameters**

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| by    | <code>number</code> |             |

**Returns**

<code>FieldValue<></code>

---

<h4><a name="databaseservice-getvendorservice-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getvendorservice"><p><code>getVendorService()</code></p>
</a></h4>

**The `getVendorService` call signature.**

**Returns**

<code>AngularFirestore<></code>

---

<h4><a name="databaseservice-increment-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#increment"><p><code>increment(path, data)</code></p>
</a></h4>

**The `increment` call signature.**

**Parameters**

| Param    | Type                                | Description |
| -------- | ----------------------------------- | ----------- |
| **path** | <code>string</code>                 |             |
| **data** | <code>Record<string, number></code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="databaseservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#init"><p><code>init(vendorService)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param             | Type                                                                                                                                                 | Description |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **vendorService** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#vendordatabaseservice" target="_blank">VendorDatabaseService</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>

---

<h4><a name="databaseservice-isglobalcachingenabled-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#isglobalcachingenabled"><p><code>isGlobalCachingEnabled()</code></p>
</a></h4>

**The `isGlobalCachingEnabled` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="databaseservice-istypedelete-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#istypedelete"><p><code>isTypeDelete(value)</code></p>
</a></h4>

**The `isTypeDelete` call signature.**

**Parameters**

| Param     | Type             | Description |
| --------- | ---------------- | ----------- |
| **value** | <code>any</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="databaseservice-istypeincrement-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#istypeincrement"><p><code>isTypeIncrement(value)</code></p>
</a></h4>

**The `isTypeIncrement` call signature.**

**Parameters**

| Param     | Type             | Description |
| --------- | ---------------- | ----------- |
| **value** | <code>any</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="databaseservice-list-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#list"><p><code>list(path, queryFn?, caching?)</code></p>
</a></h4>

**The `list` call signature.**

**Parameters**

| Param    | Type                                                                                                                                         | Description |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                          |             |
| queryFn  | <code>QueryFn</code>                                                                                                                         |             |
| caching  | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code>Observable<Type[]></code>

---

<h4><a name="databaseservice-record-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#record"><p><code>record(path, queryFn?, caching?)</code></p>
</a></h4>

**The `record` call signature.**

**Parameters**

| Param    | Type                                                                                                                                         | Description |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                          |             |
| queryFn  | <code>QueryFn</code>                                                                                                                         |             |
| caching  | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code>Observable<Record<string, Type>></code>

---

<h4><a name="databaseservice-set-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#set"><p><code>set(path, item)</code></p>
</a></h4>

**The `set` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **path** | <code>string</code> |             |
| **item** | <code>Type</code>   |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="databaseservice-setintegrations-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#setintegrations"><p><code>setIntegrations(integrations)</code></p>
</a></h4>

**The `setIntegrations` call signature.**

**Parameters**

| Param            | Type                                                                                                                                                  | Description |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **integrations** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseintegrations.html" target="_blank">DatabaseIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>

---

<h4><a name="databaseservice-setoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#setoptions"><p><code>setOptions(options)</code></p>
</a></h4>

**The `setOptions` call signature.**

**Parameters**

| Param       | Type                                                                                                                                        | Description |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **options** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseoptions.html" target="_blank">DatabaseOptions</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>

---

<h4><a name="databaseservice-streamget-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#streamget"><p><code>streamGet(path, queryFn?)</code></p>
</a></h4>

**The `streamGet` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<null | Type></code>

---

<h4><a name="databaseservice-streamlist-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#streamlist"><p><code>streamList(path, queryFn?)</code></p>
</a></h4>

**The `streamList` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<Type[]></code>

---

<h4><a name="databaseservice-streamrecord-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#streamrecord"><p><code>streamRecord(path, queryFn?)</code></p>
</a></h4>

**The `streamRecord` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<Record<string, Type>></code>

---

<h4><a name="databaseservice-update-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#update"><p><code>update(path, item)</code></p>
</a></h4>

**The `update` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **path** | <code>string</code> |             |
| **item** | <code>Type</code>   |             |

**Returns**

<code>Observable<void></code>

---

</section>
