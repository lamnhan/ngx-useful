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

| Function                                                                            | Returns type                                                                                                                                   | Description |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [cachingCollection(path, queryFn?, caching?)](#databaseservice-cachingcollection-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>                       |             |
| [cachingDoc(path, queryFn?, caching?)](#databaseservice-cachingdoc-0)               | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>                       |             |
| [cachingRecord(path, queryFn?, caching?)](#databaseservice-cachingrecord-0)         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>                       |             |
| [collection(path, queryFn?)](#databaseservice-collection-0)                         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#databasecollection" target="_blank">DatabaseCollection</a></code> |             |
| [delete(path)](#databaseservice-delete-0)                                           | <code>Observable<void></code>                                                                                                                  |             |
| [doc(path)](#databaseservice-doc-0)                                                 | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#databaseitem" target="_blank">DatabaseItem</a></code>             |             |
| [exists(path, queryFn?)](#databaseservice-exists-0)                                 | <code>Observable<boolean></code>                                                                                                               |             |
| [flatCollection(path, queryFn?)](#databaseservice-flatcollection-0)                 | <code>Observable<Type[]></code>                                                                                                                |             |
| [flatDoc(path, queryFn?)](#databaseservice-flatdoc-0)                               | <code>Observable<any></code>                                                                                                                   |             |
| [flatRecord(path, queryFn?)](#databaseservice-flatrecord-0)                         | <code>Observable<Record<string, Type>></code>                                                                                                  |             |
| [getCollection(path, queryFn?, caching?)](#databaseservice-getcollection-0)         | <code>Observable<Type[]></code>                                                                                                                |             |
| [getDoc(path, queryFn?, caching?)](#databaseservice-getdoc-0)                       | <code>Observable<any></code>                                                                                                                   |             |
| [getRecord(path, queryFn?, caching?)](#databaseservice-getrecord-0)                 | <code>Observable<Record<string, Type>></code>                                                                                                  |             |
| [increment(path, data)](#databaseservice-increment-0)                               | <code>Observable<void></code>                                                                                                                  |             |
| [init(service, options?, integrations?)](#databaseservice-init-0)                   | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>       |             |
| [set(path, item)](#databaseservice-set-0)                                           | <code>Observable<void></code>                                                                                                                  |             |
| [streamCollection(path, queryFn?)](#databaseservice-streamcollection-0)             | <code>Observable<Type[]></code>                                                                                                                |             |
| [streamDoc(path, queryFn?)](#databaseservice-streamdoc-0)                           | <code>Observable<null \| Type></code>                                                                                                          |             |
| [streamRecord(path, queryFn?)](#databaseservice-streamrecord-0)                     | <code>Observable<Record<string, Type>></code>                                                                                                  |             |
| [update(path, item)](#databaseservice-update-0)                                     | <code>Observable<void></code>                                                                                                                  |             |

<h4><a name="databaseservice-cachingcollection-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#cachingcollection"><p><code>cachingCollection(path, queryFn?, caching?)</code></p>
</a></h4>

**The `cachingCollection` call signature.**

**Parameters**

| Param    | Type                                                                                                                                | Description |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                 |             |
| queryFn  | <code>QueryFn</code>                                                                                                                |             |
| caching  | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>

---

<h4><a name="databaseservice-cachingdoc-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#cachingdoc"><p><code>cachingDoc(path, queryFn?, caching?)</code></p>
</a></h4>

**The `cachingDoc` call signature.**

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

<h4><a name="databaseservice-flatcollection-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#flatcollection"><p><code>flatCollection(path, queryFn?)</code></p>
</a></h4>

**The `flatCollection` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<Type[]></code>

---

<h4><a name="databaseservice-flatdoc-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#flatdoc"><p><code>flatDoc(path, queryFn?)</code></p>
</a></h4>

**The `flatDoc` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<any></code>

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

<h4><a name="databaseservice-getcollection-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getcollection"><p><code>getCollection(path, queryFn?, caching?)</code></p>
</a></h4>

**The `getCollection` call signature.**

**Parameters**

| Param    | Type                                                                                                                                         | Description |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                          |             |
| queryFn  | <code>QueryFn</code>                                                                                                                         |             |
| caching  | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code>Observable<Type[]></code>

---

<h4><a name="databaseservice-getdoc-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getdoc"><p><code>getDoc(path, queryFn?, caching?)</code></p>
</a></h4>

**The `getDoc` call signature.**

**Parameters**

| Param    | Type                                                                                                                                         | Description |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                          |             |
| queryFn  | <code>QueryFn</code>                                                                                                                         |             |
| caching  | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code>Observable<any></code>

---

<h4><a name="databaseservice-getrecord-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#getrecord"><p><code>getRecord(path, queryFn?, caching?)</code></p>
</a></h4>

**The `getRecord` call signature.**

**Parameters**

| Param    | Type                                                                                                                                         | Description |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **path** | <code>string</code>                                                                                                                          |             |
| queryFn  | <code>QueryFn</code>                                                                                                                         |             |
| caching  | <code>false \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/cacheconfig.html" target="_blank">CacheConfig</a></code> |             |

**Returns**

<code>Observable<Record<string, Type>></code>

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

<h4><a name="databaseservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#init"><p><code>init(service, options?, integrations?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param        | Type                                                                                                                                                  | Description |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **service**  | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#vendordatabaseservice" target="_blank">VendorDatabaseService</a></code>  |             |
| options      | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseoptions.html" target="_blank">DatabaseOptions</a></code>           |             |
| integrations | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/databaseintegrations.html" target="_blank">DatabaseIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html" target="_blank">DatabaseService</a></code>

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

<h4><a name="databaseservice-streamcollection-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#streamcollection"><p><code>streamCollection(path, queryFn?)</code></p>
</a></h4>

**The `streamCollection` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<Type[]></code>

---

<h4><a name="databaseservice-streamdoc-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html#streamdoc"><p><code>streamDoc(path, queryFn?)</code></p>
</a></h4>

**The `streamDoc` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **path** | <code>string</code>  |             |
| queryFn  | <code>QueryFn</code> |             |

**Returns**

<code>Observable<null | Type></code>

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
