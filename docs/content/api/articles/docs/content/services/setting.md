<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="settingservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html"><p>The <code>SettingService</code> class</p>
</a></h2>

**The `SettingService` class.**

<h3><a name="settingservice-properties"><p>SettingService properties</p>
</a></h3>

| Name                                                                                                              | Type                                                                                                                                                | Description |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [defaultLocale](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#defaultlocale)       | <code>string</code>                                                                                                                                 |             |
| [defaultPersona](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#defaultpersona)     | <code>string</code>                                                                                                                                 |             |
| [defaultTheme](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#defaulttheme)         | <code>string</code>                                                                                                                                 |             |
| [isInitialized](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#isinitialized)       | <code>boolean</code>                                                                                                                                |             |
| [locale](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#locale)                     | <code>string</code>                                                                                                                                 |             |
| [locales](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#locales)                   | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/builtinlistingitem.html" target="_blank">BuiltinListingItem</a>[]</code> |             |
| [onLocaleChanged](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#onlocalechanged)   | <code>ReplaySubject<string></code>                                                                                                                  |             |
| [onPersonaChanged](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#onpersonachanged) | <code>ReplaySubject<string></code>                                                                                                                  |             |
| [onThemeChanged](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#onthemechanged)     | <code>ReplaySubject<string></code>                                                                                                                  |             |
| [persona](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#persona)                   | <code>string</code>                                                                                                                                 |             |
| [personas](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#personas)                 | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/builtinlistingitem.html" target="_blank">BuiltinListingItem</a>[]</code> |             |
| [theme](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#theme)                       | <code>string</code>                                                                                                                                 |             |
| [themes](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#themes)                     | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/builtinlistingitem.html" target="_blank">BuiltinListingItem</a>[]</code> |             |

<h3><a name="settingservice-methods"><p>SettingService methods</p>
</a></h3>

| Function                                                                  | Returns type                                                                                                                           | Description |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [changeLocale(value)](#settingservice-changelocale-0)                     | <code>void</code>                                                                                                                      |             |
| [changePersona(name)](#settingservice-changepersona-0)                    | <code>void</code>                                                                                                                      |             |
| [changeTheme(name)](#settingservice-changetheme-0)                        | <code>void</code>                                                                                                                      |             |
| [init()](#settingservice-init-0)                                          | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code> |             |
| [setDefaults(defaultSettings)](#settingservice-setdefaults-0)             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code> |             |
| [setInitialLocale(locale)](#settingservice-setinitiallocale-0)            | <code>void</code>                                                                                                                      |             |
| [setInitialPersona(persona)](#settingservice-setinitialpersona-0)         | <code>void</code>                                                                                                                      |             |
| [setInitialTheme(theme)](#settingservice-setinitialtheme-0)               | <code>void</code>                                                                                                                      |             |
| [setIntegrations(integrations)](#settingservice-setintegrations-0)        | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code> |             |
| [setListing(listing)](#settingservice-setlisting-0)                       | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code> |             |
| [setOptions(options)](#settingservice-setoptions-0)                       | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code> |             |
| [setPrioritizedLocale(locale)](#settingservice-setprioritizedlocale-0)    | <code>void</code>                                                                                                                      |             |
| [setPrioritizedPersona(persona)](#settingservice-setprioritizedpersona-0) | <code>void</code>                                                                                                                      |             |
| [setPrioritizedTheme(theme)](#settingservice-setprioritizedtheme-0)       | <code>void</code>                                                                                                                      |             |
| [triggerSettingInitilizer()](#settingservice-triggersettinginitilizer-0)  | <code>void</code>                                                                                                                      |             |

<h4><a name="settingservice-changelocale-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#changelocale"><p><code>changeLocale(value)</code></p>
</a></h4>

**The `changeLocale` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **value** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-changepersona-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#changepersona"><p><code>changePersona(name)</code></p>
</a></h4>

**The `changePersona` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-changetheme-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#changetheme"><p><code>changeTheme(name)</code></p>
</a></h4>

**The `changeTheme` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#init"><p><code>init()</code></p>
</a></h4>

**The `init` call signature.**

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code>

---

<h4><a name="settingservice-setdefaults-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setdefaults"><p><code>setDefaults(defaultSettings)</code></p>
</a></h4>

**The `setDefaults` call signature.**

**Parameters**

| Param               | Type                                                                                                                                | Description |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **defaultSettings** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/appsettings.html" target="_blank">AppSettings</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code>

---

<h4><a name="settingservice-setinitiallocale-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setinitiallocale"><p><code>setInitialLocale(locale)</code></p>
</a></h4>

**The `setInitialLocale` call signature.**

**Parameters**

| Param      | Type                | Description |
| ---------- | ------------------- | ----------- |
| **locale** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-setinitialpersona-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setinitialpersona"><p><code>setInitialPersona(persona)</code></p>
</a></h4>

**The `setInitialPersona` call signature.**

**Parameters**

| Param       | Type                | Description |
| ----------- | ------------------- | ----------- |
| **persona** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-setinitialtheme-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setinitialtheme"><p><code>setInitialTheme(theme)</code></p>
</a></h4>

**The `setInitialTheme` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **theme** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-setintegrations-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setintegrations"><p><code>setIntegrations(integrations)</code></p>
</a></h4>

**The `setIntegrations` call signature.**

**Parameters**

| Param            | Type                                                                                                                                                | Description |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **integrations** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/settingintegrations.html" target="_blank">SettingIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code>

---

<h4><a name="settingservice-setlisting-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setlisting"><p><code>setListing(listing)</code></p>
</a></h4>

**The `setListing` call signature.**

**Parameters**

| Param       | Type                                                                                                                                      | Description |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **listing** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/builtinlisting.html" target="_blank">BuiltinListing</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code>

---

<h4><a name="settingservice-setoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setoptions"><p><code>setOptions(options)</code></p>
</a></h4>

**The `setOptions` call signature.**

**Parameters**

| Param       | Type                                                                                                                                      | Description |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **options** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/settingoptions.html" target="_blank">SettingOptions</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html" target="_blank">SettingService</a></code>

---

<h4><a name="settingservice-setprioritizedlocale-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setprioritizedlocale"><p><code>setPrioritizedLocale(locale)</code></p>
</a></h4>

**The `setPrioritizedLocale` call signature.**

**Parameters**

| Param      | Type                | Description |
| ---------- | ------------------- | ----------- |
| **locale** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-setprioritizedpersona-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setprioritizedpersona"><p><code>setPrioritizedPersona(persona)</code></p>
</a></h4>

**The `setPrioritizedPersona` call signature.**

**Parameters**

| Param       | Type                | Description |
| ----------- | ------------------- | ----------- |
| **persona** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-setprioritizedtheme-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#setprioritizedtheme"><p><code>setPrioritizedTheme(theme)</code></p>
</a></h4>

**The `setPrioritizedTheme` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **theme** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-triggersettinginitilizer-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html#triggersettinginitilizer"><p><code>triggerSettingInitilizer()</code></p>
</a></h4>

**The `triggerSettingInitilizer` call signature.**

**Returns**

<code>void</code>

---

</section>
