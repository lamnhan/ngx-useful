<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="cacheservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html"><p>The <code>CacheService</code> class</p>
</a></h2>

**The `CacheService` class.**

<h3><a name="cacheservice-methods"><p>CacheService methods</p>
</a></h3>

| Function                                                      | Returns type                                                                                                                       | Description |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [caching(key, refresher, cacheTime)](#cacheservice-caching-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>           |             |
| [flush()](#cacheservice-flush-0)                              | <code>Observable<void></code>                                                                                                      |             |
| [flushExpired()](#cacheservice-flushexpired-0)                | <code>Observable<void></code>                                                                                                      |             |
| [get(key, refresher?, cacheTime?)](#cacheservice-get-0)       | <code>Observable<null \| Data></code>                                                                                              |             |
| [init(config?)](#cacheservice-init-0)                         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html" target="_blank">CacheService</a></code> |             |
| [iterate(handler)](#cacheservice-iterate-0)                   | <code>Observable<Promise<unknown>></code>                                                                                          |             |
| [iterateKeys(handler)](#cacheservice-iteratekeys-0)           | <code>Observable<void></code>                                                                                                      |             |
| [remove(key, keepData?)](#cacheservice-remove-0)              | <code>Observable<void></code>                                                                                                      |             |
| [removeBulk(keys)](#cacheservice-removebulk-0)                | <code>Observable<void></code>                                                                                                      |             |
| [removeByPrefix(prefix)](#cacheservice-removebyprefix-0)      | <code>Observable<void></code>                                                                                                      |             |
| [removeBySuffix(suffix)](#cacheservice-removebysuffix-0)      | <code>Observable<void></code>                                                                                                      |             |
| [set(key, data, cacheTime)](#cacheservice-set-0)              | <code>Observable<Data></code>                                                                                                      |             |

<h4><a name="cacheservice-caching-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#caching"><p><code>caching(key, refresher, cacheTime)</code></p>
</a></h4>

**The `caching` call signature.**

**Parameters**

| Param         | Type                                                                                                                                   | Description |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **key**       | <code>string</code>                                                                                                                    |             |
| **refresher** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#cacherefresher" target="_blank">CacheRefresher</a></code> |             |
| **cacheTime** | <code>number</code>                                                                                                                    |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/caching.html" target="_blank">Caching</a></code>

---

<h4><a name="cacheservice-flush-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#flush"><p><code>flush()</code></p>
</a></h4>

**The `flush` call signature.**

**Returns**

<code>Observable<void></code>

---

<h4><a name="cacheservice-flushexpired-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#flushexpired"><p><code>flushExpired()</code></p>
</a></h4>

**The `flushExpired` call signature.**

**Returns**

<code>Observable<void></code>

---

<h4><a name="cacheservice-get-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#get"><p><code>get(key, refresher?, cacheTime?)</code></p>
</a></h4>

**The `get` call signature.**

**Parameters**

| Param     | Type                                                                                                                                   | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **key**   | <code>string</code>                                                                                                                    |             |
| refresher | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#cacherefresher" target="_blank">CacheRefresher</a></code> |             |
| cacheTime | <code>undefined \| number</code>                                                                                                       |             |

**Returns**

<code>Observable<null | Data></code>

---

<h4><a name="cacheservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#init"><p><code>init(config?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param  | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| config | <code>LocalForageOptions</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html" target="_blank">CacheService</a></code>

---

<h4><a name="cacheservice-iterate-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#iterate"><p><code>iterate(handler)</code></p>
</a></h4>

**The `iterate` call signature.**

**Parameters**

| Param       | Type                                                                                                                                                           | Description |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **handler** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#localstorageiteratehandler" target="_blank">LocalstorageIterateHandler</a></code> |             |

**Returns**

<code>Observable<Promise<unknown>></code>

---

<h4><a name="cacheservice-iteratekeys-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#iteratekeys"><p><code>iterateKeys(handler)</code></p>
</a></h4>

**The `iterateKeys` call signature.**

**Parameters**

| Param       | Type                                                                                                                                                                   | Description |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **handler** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#localstorageiteratekeyshandler" target="_blank">LocalstorageIterateKeysHandler</a></code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="cacheservice-remove-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#remove"><p><code>remove(key, keepData?)</code></p>
</a></h4>

**The `remove` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| **key**  | <code>string</code>  |             |
| keepData | <code>boolean</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="cacheservice-removebulk-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#removebulk"><p><code>removeBulk(keys)</code></p>
</a></h4>

**The `removeBulk` call signature.**

**Parameters**

| Param    | Type                  | Description |
| -------- | --------------------- | ----------- |
| **keys** | <code>string[]</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="cacheservice-removebyprefix-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#removebyprefix"><p><code>removeByPrefix(prefix)</code></p>
</a></h4>

**The `removeByPrefix` call signature.**

**Parameters**

| Param      | Type                | Description |
| ---------- | ------------------- | ----------- |
| **prefix** | <code>string</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="cacheservice-removebysuffix-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#removebysuffix"><p><code>removeBySuffix(suffix)</code></p>
</a></h4>

**The `removeBySuffix` call signature.**

**Parameters**

| Param      | Type                | Description |
| ---------- | ------------------- | ----------- |
| **suffix** | <code>string</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="cacheservice-set-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html#set"><p><code>set(key, data, cacheTime)</code></p>
</a></h4>

**The `set` call signature.**

**Parameters**

| Param         | Type                | Description |
| ------------- | ------------------- | ----------- |
| **key**       | <code>string</code> |             |
| **data**      | <code>Data</code>   |             |
| **cacheTime** | <code>number</code> |             |

**Returns**

<code>Observable<Data></code>

---

</section>
