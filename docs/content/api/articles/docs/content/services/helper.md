<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="helperservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html"><p>The <code>HelperService</code> class</p>
</a></h2>

**The `HelperService` class.**

<h3><a name="helperservice-methods"><p>HelperService methods</p>
</a></h3>

| Function                                                                                           | Returns type                     | Description |
| -------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- |
| [cleanupStr(value)](#helperservice-cleanupstr-0)                                                   | <code>string</code>              |             |
| [createPopup(config)](#helperservice-createpopup-0)                                                | <code>void</code>                |             |
| [decodeJWTPayloadWithoutVerification(token)](#helperservice-decodejwtpayloadwithoutverification-0) | <code>any</code>                 |             |
| [filter(items, keyword, fields?)](#helperservice-filter-0)                                         | <code>Item[]</code>              |             |
| [getHost()](#helperservice-gethost-0)                                                              | <code>string</code>              |             |
| [isExpiredInSeconds(expiredTime, costMore?)](#helperservice-isexpiredinseconds-0)                  | <code>boolean</code>             |             |
| [isExpiredJWTWithoutVerification(token)](#helperservice-isexpiredjwtwithoutverification-0)         | <code>boolean</code>             |             |
| [md5(str, key?, raw?)](#helperservice-md5-0)                                                       | <code>string</code>              |             |
| [o1i(object, clone?)](#helperservice-o1i-0)                                                        | <code>null \| Type</code>        |             |
| [o2a(object, clone?, limit?)](#helperservice-o2a-0)                                                | <code>Type[]</code>              |             |
| [orderBy(collection, iteratees, orders, guard?)](#helperservice-orderby-0)                         | <code>any</code>                 |             |
| [retryInterval(matched, interval?, timeout?)](#helperservice-retryinterval-0)                      | <code>Observable<unknown></code> |             |

<h4><a name="helperservice-cleanupstr-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#cleanupstr"><p><code>cleanupStr(value)</code></p>
</a></h4>

**The `cleanupStr` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **value** | <code>string</code> |             |

**Returns**

<code>string</code>

---

<h4><a name="helperservice-createpopup-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#createpopup"><p><code>createPopup(config)</code></p>
</a></h4>

**The `createPopup` call signature.**

**Parameters**

| Param      | Type                                                                                                                                  | Description |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **config** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/popupconfigs.html" target="_blank">PopupConfigs</a></code> |             |

**Returns**

<code>void</code>

---

<h4><a name="helperservice-decodejwtpayloadwithoutverification-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#decodejwtpayloadwithoutverification"><p><code>decodeJWTPayloadWithoutVerification(token)</code></p>
</a></h4>

**The `decodeJWTPayloadWithoutVerification` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **token** | <code>string</code> |             |

**Returns**

<code>any</code>

---

<h4><a name="helperservice-filter-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#filter"><p><code>filter(items, keyword, fields?)</code></p>
</a></h4>

**The `filter` call signature.**

**Parameters**

| Param       | Type                  | Description |
| ----------- | --------------------- | ----------- |
| **items**   | <code>Item[]</code>   |             |
| **keyword** | <code>string</code>   |             |
| fields      | <code>string[]</code> |             |

**Returns**

<code>Item[]</code>

---

<h4><a name="helperservice-gethost-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#gethost"><p><code>getHost()</code></p>
</a></h4>

**The `getHost` call signature.**

**Returns**

<code>string</code>

---

<h4><a name="helperservice-isexpiredinseconds-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#isexpiredinseconds"><p><code>isExpiredInSeconds(expiredTime, costMore?)</code></p>
</a></h4>

**The `isExpiredInSeconds` call signature.**

**Parameters**

| Param           | Type                | Description |
| --------------- | ------------------- | ----------- |
| **expiredTime** | <code>number</code> |             |
| costMore        | <code>number</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="helperservice-isexpiredjwtwithoutverification-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#isexpiredjwtwithoutverification"><p><code>isExpiredJWTWithoutVerification(token)</code></p>
</a></h4>

**The `isExpiredJWTWithoutVerification` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **token** | <code>string</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="helperservice-md5-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#md5"><p><code>md5(str, key?, raw?)</code></p>
</a></h4>

**The `md5` call signature.**

**Parameters**

| Param   | Type                                    | Description |
| ------- | --------------------------------------- | ----------- |
| **str** | <code>string</code>                     |             |
| key     | <code>string \| undefined</code>        |             |
| raw     | <code>undefined \| false \| true</code> |             |

**Returns**

<code>string</code>

---

<h4><a name="helperservice-o1i-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#o1i"><p><code>o1i(object, clone?)</code></p>
</a></h4>

**The `o1i` call signature.**

**Parameters**

| Param      | Type                 | Description |
| ---------- | -------------------- | ----------- |
| **object** | <code>object</code>  |             |
| clone      | <code>boolean</code> |             |

**Returns**

<code>null | Type</code>

---

<h4><a name="helperservice-o2a-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#o2a"><p><code>o2a(object, clone?, limit?)</code></p>
</a></h4>

**The `o2a` call signature.**

**Parameters**

| Param      | Type                             | Description |
| ---------- | -------------------------------- | ----------- |
| **object** | <code>object</code>              |             |
| clone      | <code>boolean</code>             |             |
| limit      | <code>undefined \| number</code> |             |

**Returns**

<code>Type[]</code>

---

<h4><a name="helperservice-orderby-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#orderby"><p><code>orderBy(collection, iteratees, orders, guard?)</code></p>
</a></h4>

**The `orderBy` call signature.**

**Parameters**

| Param          | Type                   | Description |
| -------------- | ---------------------- | ----------- |
| **collection** | <code>unknown[]</code> |             |
| **iteratees**  | <code>string[]</code>  |             |
| **orders**     | <code>string[]</code>  |             |
| guard          | <code>unknown</code>   |             |

**Returns**

<code>any</code>

---

<h4><a name="helperservice-retryinterval-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html#retryinterval"><p><code>retryInterval(matched, interval?, timeout?)</code></p>
</a></h4>

**The `retryInterval` call signature.**

**Parameters**

| Param       | Type                  | Description |
| ----------- | --------------------- | ----------- |
| **matched** | <code>function</code> |             |
| interval    | <code>number</code>   |             |
| timeout     | <code>number</code>   |             |

**Returns**

<code>Observable<unknown></code>

---

</section>
