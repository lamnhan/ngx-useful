<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="navservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html"><p>The <code>NavService</code> class</p>
</a></h2>

**Advanced navigation**

<h3><a name="navservice-properties"><p>NavService properties</p>
</a></h3>

| Name                                                                                                                      | Type                                     | Description |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| [isBackable](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#isbackable)                         | <code>boolean</code>                     |             |
| [loading](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#loading)                               | <code>boolean</code>                     |             |
| [menuIcon](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#menuicon)                             | <code>string</code>                      |             |
| [menuVisible](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#menuvisible)                       | <code>boolean</code>                     |             |
| [onChanges](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#onchanges)                           | <code>ReplaySubject<NavService<>></code> |             |
| [onNavigationEnd](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#onnavigationend)               | <code>ReplaySubject<NavService<>></code> |             |
| [onRefreshRouterLink](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#onrefreshrouterlink)       | <code>ReplaySubject<void></code>         |             |
| [onRouteConfigLoadEnd](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#onrouteconfigloadend)     | <code>ReplaySubject<NavService<>></code> |             |
| [onRouteConfigLoadStart](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#onrouteconfigloadstart) | <code>ReplaySubject<NavService<>></code> |             |
| [route](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#route)                                   | <code>ActivatedRoute</code>              |             |
| [routeData](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routedata)                           | <code>Record<string, unknown></code>     |             |
| [routeExtras](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routeextras)                       | <code>NavigationExtras</code>            |             |
| [routePosition](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routeposition)                   | <code>number</code>                      |             |
| [routeTitle](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routetitle)                         | <code>undefined \| string</code>         |             |
| [routeUrl](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#routeurl)                             | <code>string</code>                      |             |
| [router](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#router)                                 | <code>Router</code>                      |             |

<h3><a name="navservice-methods"><p>NavService methods</p>
</a></h3>

| Function                                                                 | Returns type                                                                                                                   | Description |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [back()](#navservice-back-0)                                             | <code>undefined \| Promise<boolean></code>                                                                                     |             |
| [getMenuIcon()](#navservice-getmenuicon-0)                               | <code>string</code>                                                                                                            |             |
| [getRoute(input, withLocale?)](#navservice-getroute-0)                   | <code>string[]</code>                                                                                                          |             |
| [getRouteUrl(input, withLocale?)](#navservice-getrouteurl-0)             | <code>string</code>                                                                                                            |             |
| [hideLoadingIndicator()](#navservice-hideloadingindicator-0)             | <code>void</code>                                                                                                              |             |
| [init()](#navservice-init-0)                                             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code> |             |
| [isActive(url, exact?)](#navservice-isactive-0)                          | <code>boolean</code>                                                                                                           |             |
| [isBackwardable()](#navservice-isbackwardable-0)                         | <code>boolean</code>                                                                                                           |             |
| [isRouteActive(input, exact?, withLocale?)](#navservice-isrouteactive-0) | <code>boolean</code>                                                                                                           |             |
| [menuAction()](#navservice-menuaction-0)                                 | <code>void \| Promise<boolean></code>                                                                                          |             |
| [navigate(input, advanced?)](#navservice-navigate-0)                     | <code>Promise<boolean></code>                                                                                                  |             |
| [scrollTo(input, offset?, smooth?)](#navservice-scrollto-0)              | <code>void</code>                                                                                                              |             |
| [scrollToTop(offset?, smooth?)](#navservice-scrolltotop-0)               | <code>void</code>                                                                                                              |             |
| [setHooks(hooks)](#navservice-sethooks-0)                                | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code> |             |
| [setI18n(i18nRegistry)](#navservice-seti18n-0)                           | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code> |             |
| [setIntegrations(integrations)](#navservice-setintegrations-0)           | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code> |             |
| [setOptions(options)](#navservice-setoptions-0)                          | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code> |             |
| [showLoadingIndicator()](#navservice-showloadingindicator-0)             | <code>void</code>                                                                                                              |             |
| [toggleMenu()](#navservice-togglemenu-0)                                 | <code>void</code>                                                                                                              |             |

<h4><a name="navservice-back-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#back"><p><code>back()</code></p>
</a></h4>

**The `back` call signature.**

**Returns**

<code>undefined | Promise<boolean></code>

---

<h4><a name="navservice-getmenuicon-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#getmenuicon"><p><code>getMenuIcon()</code></p>
</a></h4>

**The `getMenuIcon` call signature.**

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

<h4><a name="navservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#init"><p><code>init()</code></p>
</a></h4>

**The `init` call signature.**

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

<h4><a name="navservice-scrollto-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#scrollto"><p><code>scrollTo(input, offset?, smooth?)</code></p>
</a></h4>

**The `scrollTo` call signature.**

**Parameters**

| Param     | Type                                         | Description |
| --------- | -------------------------------------------- | ----------- |
| **input** | <code>number \| string \| HTMLElement</code> |             |
| offset    | <code>number</code>                          |             |
| smooth    | <code>boolean</code>                         |             |

**Returns**

<code>void</code>

---

<h4><a name="navservice-scrolltotop-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#scrolltotop"><p><code>scrollToTop(offset?, smooth?)</code></p>
</a></h4>

**The `scrollToTop` call signature.**

**Parameters**

| Param  | Type                 | Description |
| ------ | -------------------- | ----------- |
| offset | <code>number</code>  |             |
| smooth | <code>boolean</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="navservice-sethooks-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#sethooks"><p><code>setHooks(hooks)</code></p>
</a></h4>

**The `setHooks` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **hooks** | <code>object</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code>

---

<h4><a name="navservice-seti18n-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#seti18n"><p><code>setI18n(i18nRegistry)</code></p>
</a></h4>

**The `setI18n` call signature.**

**Parameters**

| Param            | Type                | Description |
| ---------------- | ------------------- | ----------- |
| **i18nRegistry** | <code>object</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code>

---

<h4><a name="navservice-setintegrations-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#setintegrations"><p><code>setIntegrations(integrations)</code></p>
</a></h4>

**The `setIntegrations` call signature.**

**Parameters**

| Param            | Type                                                                                                                                        | Description |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **integrations** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/navintegrations.html" target="_blank">NavIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code>

---

<h4><a name="navservice-setoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html#setoptions"><p><code>setOptions(options)</code></p>
</a></h4>

**The `setOptions` call signature.**

**Parameters**

| Param       | Type                                                                                                                              | Description |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **options** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/navoptions.html" target="_blank">NavOptions</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html" target="_blank">NavService</a></code>

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
