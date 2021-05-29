<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="navservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html"><p>The <code>NavService</code> class</p>
</a></h2>

**Advanced navigation**

<h3><a name="navservice-properties"><p>NavService properties</p>
</a></h3>

| Name                                                                                                                | Type                                 | Description |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------- |
| [loading](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#loading)                         | <code>boolean</code>                 |             |
| [menuVisible](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#menuvisible)                 | <code>boolean</code>                 |             |
| [onRefreshRouterLink](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#onrefreshrouterlink) | <code>ReplaySubject<void></code>     |             |
| [routeData](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routedata)                     | <code>Record<string, unknown></code> |             |
| [routeExtras](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routeextras)                 | <code>NavigationExtras</code>        |             |
| [routeTitle](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routetitle)                   | <code>undefined \| string</code>     |             |
| [routeUrl](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routeurl)                       | <code>string</code>                  |             |

<h3><a name="navservice-methods"><p>NavService methods</p>
</a></h3>

| Function                                                                   | Returns type                                                                                                                   | Description |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [back()](#navservice-back-0)                                               | <code>undefined \| Promise<boolean></code>                                                                                     |             |
| [getMenuIcon(menuClass?, backClass?)](#navservice-getmenuicon-0)           | <code>string</code>                                                                                                            |             |
| [getRoute(input, withLocale?)](#navservice-getroute-0)                     | <code>string[]</code>                                                                                                          |             |
| [getRouteUrl(input, withLocale?)](#navservice-getrouteurl-0)               | <code>string</code>                                                                                                            |             |
| [hideLoadingIndicator()](#navservice-hideloadingindicator-0)               | <code>void</code>                                                                                                              |             |
| [init(options?, integrations?, hooks?, i18nRegistry?)](#navservice-init-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code> |             |
| [isActive(url, exact?)](#navservice-isactive-0)                            | <code>boolean</code>                                                                                                           |             |
| [isBackwardable()](#navservice-isbackwardable-0)                           | <code>boolean</code>                                                                                                           |             |
| [isRouteActive(input, exact?, withLocale?)](#navservice-isrouteactive-0)   | <code>boolean</code>                                                                                                           |             |
| [menuAction()](#navservice-menuaction-0)                                   | <code>void \| Promise<boolean></code>                                                                                          |             |
| [navigate(input, advanced?)](#navservice-navigate-0)                       | <code>Promise<boolean></code>                                                                                                  |             |
| [scrollTo(input)](#navservice-scrollto-0)                                  | <code>undefined \| void</code>                                                                                                 |             |
| [scrollToTop()](#navservice-scrolltotop-0)                                 | <code>undefined \| void</code>                                                                                                 |             |
| [showLoadingIndicator()](#navservice-showloadingindicator-0)               | <code>void</code>                                                                                                              |             |
| [toggleMenu()](#navservice-togglemenu-0)                                   | <code>void</code>                                                                                                              |             |

<h4><a name="navservice-back-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#back"><p><code>back()</code></p>
</a></h4>

**The `back` call signature.**

**Returns**

<code>undefined | Promise<boolean></code>

---

<h4><a name="navservice-getmenuicon-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#getmenuicon"><p><code>getMenuIcon(menuClass?, backClass?)</code></p>
</a></h4>

**The `getMenuIcon` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| menuClass | <code>string</code> |             |
| backClass | <code>string</code> |             |

**Returns**

<code>string</code>

---

<h4><a name="navservice-getroute-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#getroute"><p><code>getRoute(input, withLocale?)</code></p>
</a></h4>

**The `getRoute` call signature.**

**Parameters**

| Param      | Type                             | Description |
| ---------- | -------------------------------- | ----------- |
| **input**  | <code>string \| string[]</code>  |             |
| withLocale | <code>undefined \| string</code> |             |

**Returns**

<code>string[]</code>

---

<h4><a name="navservice-getrouteurl-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#getrouteurl"><p><code>getRouteUrl(input, withLocale?)</code></p>
</a></h4>

**The `getRouteUrl` call signature.**

**Parameters**

| Param      | Type                             | Description |
| ---------- | -------------------------------- | ----------- |
| **input**  | <code>string \| string[]</code>  |             |
| withLocale | <code>undefined \| string</code> |             |

**Returns**

<code>string</code>

---

<h4><a name="navservice-hideloadingindicator-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#hideloadingindicator"><p><code>hideLoadingIndicator()</code></p>
</a></h4>

**The `hideLoadingIndicator` call signature.**

**Returns**

<code>void</code>

---

<h4><a name="navservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#init"><p><code>init(options?, integrations?, hooks?, i18nRegistry?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param        | Type                                                                                                                                        | Description |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| options      | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/navoptions.html" target="_blank">NavOptions</a></code>           |             |
| integrations | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/navintegrations.html" target="_blank">NavIntegrations</a></code> |             |
| hooks        | <code>object</code>                                                                                                                         |             |
| i18nRegistry | <code>undefined \| object</code>                                                                                                            |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code>

---

<h4><a name="navservice-isactive-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#isactive"><p><code>isActive(url, exact?)</code></p>
</a></h4>

**The `isActive` call signature.**

**Parameters**

| Param   | Type                 | Description |
| ------- | -------------------- | ----------- |
| **url** | <code>string</code>  |             |
| exact   | <code>boolean</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="navservice-isbackwardable-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#isbackwardable"><p><code>isBackwardable()</code></p>
</a></h4>

**The `isBackwardable` call signature.**

**Returns**

<code>boolean</code>

---

<h4><a name="navservice-isrouteactive-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#isrouteactive"><p><code>isRouteActive(input, exact?, withLocale?)</code></p>
</a></h4>

**The `isRouteActive` call signature.**

**Parameters**

| Param      | Type                             | Description |
| ---------- | -------------------------------- | ----------- |
| **input**  | <code>string \| string[]</code>  |             |
| exact      | <code>boolean</code>             |             |
| withLocale | <code>undefined \| string</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="navservice-menuaction-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#menuaction"><p><code>menuAction()</code></p>
</a></h4>

**The `menuAction` call signature.**

**Returns**

<code>void | Promise<boolean></code>

---

<h4><a name="navservice-navigate-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#navigate"><p><code>navigate(input, advanced?)</code></p>
</a></h4>

**The `navigate` call signature.**

**Parameters**

| Param     | Type                                                                                                                                | Description |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **input** | <code>string \| string[]</code>                                                                                                     |             |
| advanced  | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/navadvanced.html" target="_blank">NavAdvanced</a></code> |             |

**Returns**

<code>Promise<boolean></code>

---

<h4><a name="navservice-scrollto-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#scrollto"><p><code>scrollTo(input)</code></p>
</a></h4>

**The `scrollTo` call signature.**

**Parameters**

| Param     | Type                               | Description |
| --------- | ---------------------------------- | ----------- |
| **input** | <code>string \| HTMLElement</code> |             |

**Returns**

<code>undefined | void</code>

---

<h4><a name="navservice-scrolltotop-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#scrolltotop"><p><code>scrollToTop()</code></p>
</a></h4>

**The `scrollToTop` call signature.**

**Returns**

<code>undefined | void</code>

---

<h4><a name="navservice-showloadingindicator-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#showloadingindicator"><p><code>showLoadingIndicator()</code></p>
</a></h4>

**The `showLoadingIndicator` call signature.**

**Returns**

<code>void</code>

---

<h4><a name="navservice-togglemenu-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#togglemenu"><p><code>toggleMenu()</code></p>
</a></h4>

**The `toggleMenu` call signature.**

**Returns**

<code>void</code>

---

</section>
