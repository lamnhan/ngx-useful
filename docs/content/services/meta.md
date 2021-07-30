<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="metaservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html"><p>The <code>MetaService</code> class</p>
</a></h2>

**The `MetaService` class.**

<h3><a name="metaservice-properties"><p>MetaService properties</p>
</a></h3>

| Name                                                                                             | Type                                                                                                                          | Description |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [appMetas](https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#appmetas)   | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/appmetas.html" target="_blank">AppMetas</a></code> |             |
| [appSuffix](https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#appsuffix) | <code>string</code>                                                                                                           |             |

<h3><a name="metaservice-methods"><p>MetaService methods</p>
</a></h3>

| Function                                                                                 | Returns type                                                                                                                     | Description |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [changePageLang(code)](#metaservice-changepagelang-0)                                    | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code> |             |
| [changePageMetas(customMetas?, withSuffix?, forLocale?)](#metaservice-changepagemetas-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code> |             |
| [changePageTitle(title)](#metaservice-changepagetitle-0)                                 | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code> |             |
| [init(defaultMetas, metaTranslations?)](#metaservice-init-0)                             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code> |             |
| [setIntegrations(integrations)](#metaservice-setintegrations-0)                          | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code> |             |
| [setOptions(options)](#metaservice-setoptions-0)                                         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code> |             |
| [setSuffix(defaultSuffix, suffixTranslations?)](#metaservice-setsuffix-0)                | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code> |             |

<h4><a name="metaservice-changepagelang-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#changepagelang"><p><code>changePageLang(code)</code></p>
</a></h4>

**The `changePageLang` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **code** | <code>string</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code>

---

<h4><a name="metaservice-changepagemetas-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#changepagemetas"><p><code>changePageMetas(customMetas?, withSuffix?, forLocale?)</code></p>
</a></h4>

**The `changePageMetas` call signature.**

**Parameters**

| Param       | Type                                                                                                                                      | Description |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| customMetas | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/appcustommetas.html" target="_blank">AppCustomMetas</a></code> |             |
| withSuffix  | <code>boolean</code>                                                                                                                      |             |
| forLocale   | <code>undefined \| string</code>                                                                                                          |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code>

---

<h4><a name="metaservice-changepagetitle-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#changepagetitle"><p><code>changePageTitle(title)</code></p>
</a></h4>

**The `changePageTitle` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **title** | <code>string</code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code>

---

<h4><a name="metaservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#init"><p><code>init(defaultMetas, metaTranslations?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param            | Type                                                                                                                                          | Description |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **defaultMetas** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/appmetas.html" target="_blank">AppMetas</a></code>                 |             |
| metaTranslations | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/metatranslations.html" target="_blank">MetaTranslations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code>

---

<h4><a name="metaservice-setintegrations-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#setintegrations"><p><code>setIntegrations(integrations)</code></p>
</a></h4>

**The `setIntegrations` call signature.**

**Parameters**

| Param            | Type                                                                                                                                          | Description |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **integrations** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/metaintegrations.html" target="_blank">MetaIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code>

---

<h4><a name="metaservice-setoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#setoptions"><p><code>setOptions(options)</code></p>
</a></h4>

**The `setOptions` call signature.**

**Parameters**

| Param       | Type                                                                                                                                | Description |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **options** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/metaoptions.html" target="_blank">MetaOptions</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code>

---

<h4><a name="metaservice-setsuffix-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html#setsuffix"><p><code>setSuffix(defaultSuffix, suffixTranslations?)</code></p>
</a></h4>

**The `setSuffix` call signature.**

**Parameters**

| Param              | Type                                | Description |
| ------------------ | ----------------------------------- | ----------- |
| **defaultSuffix**  | <code>string</code>                 |             |
| suffixTranslations | <code>Record<string, string></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html" target="_blank">MetaService</a></code>

---

</section>
