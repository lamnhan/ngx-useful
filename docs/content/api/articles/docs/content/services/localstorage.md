<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="localstorageservice" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html"><p>The <code>LocalstorageService</code> class</p>
</a></h2>

**The `LocalstorageService` class.**

<h3><a name="localstorageservice-methods"><p>LocalstorageService methods</p>
</a></h3>

| Function                                                        | Returns type                                                                                                                   | Description |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [clear()](#localstorageservice-clear-0)                         | <code>Observable<void></code>                                                                                                  |             |
| [get(key)](#localstorageservice-get-0)                          | <code>Observable<null \| Data></code>                                                                                          |             |
| [getBulk(keys)](#localstorageservice-getbulk-0)                 | <code>Observable<Result></code>                                                                                                |             |
| [getLocalforage()](#localstorageservice-getlocalforage-0)       | <code><a href="https://ngx-useful.lamnhan.com/interfaces/localforage.html" target="_blank">LocalForage</a></code>              |             |
| [increment(key, by?)](#localstorageservice-increment-0)         | <code>Observable<number></code>                                                                                                |             |
| [init(config?)](#localstorageservice-init-0)                    | <code><a href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html" target="_blank">LocalstorageService</a></code> |             |
| [iterate(handler)](#localstorageservice-iterate-0)              | <code>Observable<Promise<unknown>></code>                                                                                      |             |
| [iterateKeys(handler)](#localstorageservice-iteratekeys-0)      | <code>Observable<void></code>                                                                                                  |             |
| [keys()](#localstorageservice-keys-0)                           | <code>Observable<string[]></code>                                                                                              |             |
| [remove(key)](#localstorageservice-remove-0)                    | <code>Observable<void></code>                                                                                                  |             |
| [removeBulk(keys)](#localstorageservice-removebulk-0)           | <code>Observable<void></code>                                                                                                  |             |
| [removeByPrefix(prefix)](#localstorageservice-removebyprefix-0) | <code>Observable<void></code>                                                                                                  |             |
| [removeBySuffix(suffix)](#localstorageservice-removebysuffix-0) | <code>Observable<void></code>                                                                                                  |             |
| [set(key, data)](#localstorageservice-set-0)                    | <code>Observable<Data></code>                                                                                                  |             |
| [setBulk(input)](#localstorageservice-setbulk-0)                | <code>Observable<unknown[]></code>                                                                                             |             |

<h4><a name="localstorageservice-clear-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#clear"><p><code>clear()</code></p>
</a></h4>

**The `clear` call signature.**

**Returns**

<code>Observable<void></code>

---

<h4><a name="localstorageservice-get-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#get"><p><code>get(key)</code></p>
</a></h4>

**The `get` call signature.**

**Parameters**

| Param   | Type                | Description |
| ------- | ------------------- | ----------- |
| **key** | <code>string</code> |             |

**Returns**

<code>Observable<null | Data></code>

---

<h4><a name="localstorageservice-getbulk-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#getbulk"><p><code>getBulk(keys)</code></p>
</a></h4>

**The `getBulk` call signature.**

**Parameters**

| Param    | Type                  | Description |
| -------- | --------------------- | ----------- |
| **keys** | <code>string[]</code> |             |

**Returns**

<code>Observable<Result></code>

---

<h4><a name="localstorageservice-getlocalforage-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#getlocalforage"><p><code>getLocalforage()</code></p>
</a></h4>

**The `getLocalforage` call signature.**

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/interfaces/localforage.html" target="_blank">LocalForage</a></code>

---

<h4><a name="localstorageservice-increment-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#increment"><p><code>increment(key, by?)</code></p>
</a></h4>

**The `increment` call signature.**

**Parameters**

| Param   | Type                | Description |
| ------- | ------------------- | ----------- |
| **key** | <code>string</code> |             |
| by      | <code>number</code> |             |

**Returns**

<code>Observable<number></code>

---

<h4><a name="localstorageservice-init-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#init"><p><code>init(config?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param  | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| config | <code>LocalForageOptions</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html" target="_blank">LocalstorageService</a></code>

---

<h4><a name="localstorageservice-iterate-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#iterate"><p><code>iterate(handler)</code></p>
</a></h4>

**The `iterate` call signature.**

**Parameters**

| Param       | Type                                                                                                                                         | Description |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **handler** | <code><a href="https://ngx-useful.lamnhan.com/globals.html#localstorageiteratehandler" target="_blank">LocalstorageIterateHandler</a></code> |             |

**Returns**

<code>Observable<Promise<unknown>></code>

---

<h4><a name="localstorageservice-iteratekeys-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#iteratekeys"><p><code>iterateKeys(handler)</code></p>
</a></h4>

**The `iterateKeys` call signature.**

**Parameters**

| Param       | Type                                                                                                                                                 | Description |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **handler** | <code><a href="https://ngx-useful.lamnhan.com/globals.html#localstorageiteratekeyshandler" target="_blank">LocalstorageIterateKeysHandler</a></code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="localstorageservice-keys-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#keys"><p><code>keys()</code></p>
</a></h4>

**The `keys` call signature.**

**Returns**

<code>Observable<string[]></code>

---

<h4><a name="localstorageservice-remove-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#remove"><p><code>remove(key)</code></p>
</a></h4>

**The `remove` call signature.**

**Parameters**

| Param   | Type                | Description |
| ------- | ------------------- | ----------- |
| **key** | <code>string</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="localstorageservice-removebulk-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#removebulk"><p><code>removeBulk(keys)</code></p>
</a></h4>

**The `removeBulk` call signature.**

**Parameters**

| Param    | Type                  | Description |
| -------- | --------------------- | ----------- |
| **keys** | <code>string[]</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="localstorageservice-removebyprefix-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#removebyprefix"><p><code>removeByPrefix(prefix)</code></p>
</a></h4>

**The `removeByPrefix` call signature.**

**Parameters**

| Param      | Type                | Description |
| ---------- | ------------------- | ----------- |
| **prefix** | <code>string</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="localstorageservice-removebysuffix-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#removebysuffix"><p><code>removeBySuffix(suffix)</code></p>
</a></h4>

**The `removeBySuffix` call signature.**

**Parameters**

| Param      | Type                | Description |
| ---------- | ------------------- | ----------- |
| **suffix** | <code>string</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="localstorageservice-set-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#set"><p><code>set(key, data)</code></p>
</a></h4>

**The `set` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **key**  | <code>string</code> |             |
| **data** | <code>Data</code>   |             |

**Returns**

<code>Observable<Data></code>

---

<h4><a name="localstorageservice-setbulk-0" href="https://ngx-useful.lamnhan.com/classes/localstorageservice.html#setbulk"><p><code>setBulk(input)</code></p>
</a></h4>

**The `setBulk` call signature.**

**Parameters**

| Param     | Type                                 | Description |
| --------- | ------------------------------------ | ----------- |
| **input** | <code>Record<string, unknown></code> |             |

**Returns**

<code>Observable<unknown[]></code>

---

</section>
