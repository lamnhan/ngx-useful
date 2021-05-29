<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="appservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html"><p>The <code>AppService</code> class</p>
</a></h2>

**General app related methods**

<h3><a name="appservice-properties"><p>AppService properties</p>
</a></h3>

| Name                                                                                              | Type                                 | Description |
| ------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------- |
| [customData](https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#customdata) | <code>Record<string, unknown></code> |             |
| [host](https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#host)             | <code>string</code>                  |             |
| [viewHeight](https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#viewheight) | <code>number</code>                  |             |
| [viewWidth](https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#viewwidth)   | <code>number</code>                  |             |

<h3><a name="appservice-methods"><p>AppService methods</p>
</a></h3>

| Function                                                       | Returns type                                                                                                                   | Description |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [addData(data)](#appservice-adddata-0)                         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html" target="_blank">AppService</a></code> |             |
| [getData(key)](#appservice-getdata-0)                          | <code>Value</code>                                                                                                             |             |
| [hideSplashScreen()](#appservice-hidesplashscreen-0)           | <code>void</code>                                                                                                              |             |
| [init(options?, customData?, dataLoader?)](#appservice-init-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html" target="_blank">AppService</a></code> |             |
| [share(title?, text?, url?)](#appservice-share-0)              | <code>null \| string \| Promise<void></code>                                                                                   |             |

<h4><a name="appservice-adddata-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#adddata"><p><code>addData(data)</code></p>
</a></h4>

**The `addData` call signature.**

**Parameters**

| Param    | Type                                 | Description |
| -------- | ------------------------------------ | ----------- |
| **data** | <code>Record<string, unknown></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html" target="_blank">AppService</a></code>

---

<h4><a name="appservice-getdata-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#getdata"><p><code>getData(key)</code></p>
</a></h4>

**The `getData` call signature.**

**Parameters**

| Param   | Type                | Description |
| ------- | ------------------- | ----------- |
| **key** | <code>string</code> |             |

**Returns**

<code>Value</code>

---

<h4><a name="appservice-hidesplashscreen-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#hidesplashscreen"><p><code>hideSplashScreen()</code></p>
</a></h4>

**The `hideSplashScreen` call signature.**

**Returns**

<code>void</code>

---

<h4><a name="appservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#init"><p><code>init(options?, customData?, dataLoader?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param      | Type                                                                                                                              | Description |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| options    | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/appoptions.html" target="_blank">AppOptions</a></code> |             |
| customData | <code>Record<string, unknown></code>                                                                                              |             |
| dataLoader | <code>Observable<Record<string, unknown>></code>                                                                                  |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html" target="_blank">AppService</a></code>

---

<h4><a name="appservice-share-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html#share"><p><code>share(title?, text?, url?)</code></p>
</a></h4>

**The `share` call signature.**

**Parameters**

| Param | Type                             | Description |
| ----- | -------------------------------- | ----------- |
| title | <code>undefined \| string</code> |             |
| text  | <code>undefined \| string</code> |             |
| url   | <code>undefined \| string</code> |             |

**Returns**

<code>null | string | Promise<void></code>

---

</section>
