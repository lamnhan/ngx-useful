<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="settingservice" href="https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html"><p>The <code>SettingService</code> class</p>
</a></h2>

**The `SettingService` class.**

<h3><a name="settingservice-properties"><p>SettingService properties</p>
</a></h3>

| Name                                                                                                         | Type                                                                                                                                     | Description |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [locale](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#locale)                     | <code>string</code>                                                                                                                      |             |
| [locales](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#locales)                   | <code><a href="https://ngx-useful.lamnhan.com/docs/content/interfaces/builtindataitem.html" target="_blank">BuiltinDataItem</a>[]</code> |             |
| [onLocaleChanged](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#onlocalechanged)   | <code>ReplaySubject<string></code>                                                                                                       |             |
| [onPersonaChanged](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#onpersonachanged) | <code>ReplaySubject<string></code>                                                                                                       |             |
| [onThemeChanged](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#onthemechanged)     | <code>ReplaySubject<string></code>                                                                                                       |             |
| [persona](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#persona)                   | <code>string</code>                                                                                                                      |             |
| [personas](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#personas)                 | <code><a href="https://ngx-useful.lamnhan.com/docs/content/interfaces/builtindataitem.html" target="_blank">BuiltinDataItem</a>[]</code> |             |
| [theme](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#theme)                       | <code>string</code>                                                                                                                      |             |
| [themes](https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#themes)                     | <code><a href="https://ngx-useful.lamnhan.com/docs/content/interfaces/builtindataitem.html" target="_blank">BuiltinDataItem</a>[]</code> |             |

<h3><a name="settingservice-methods"><p>SettingService methods</p>
</a></h3>

| Function                                                              | Returns type                                                                                                                      | Description |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [changeLocale(value)](#settingservice-changelocale-0)                 | <code>void</code>                                                                                                                 |             |
| [changePersona(name)](#settingservice-changepersona-0)                | <code>void</code>                                                                                                                 |             |
| [changeTheme(name)](#settingservice-changetheme-0)                    | <code>void</code>                                                                                                                 |             |
| [init(options?, settingData?, integrations?)](#settingservice-init-0) | <code><a href="https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html" target="_blank">SettingService</a></code> |             |

<h4><a name="settingservice-changelocale-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#changelocale"><p><code>changeLocale(value)</code></p>
</a></h4>

**The `changeLocale` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **value** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-changepersona-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#changepersona"><p><code>changePersona(name)</code></p>
</a></h4>

**The `changePersona` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-changetheme-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#changetheme"><p><code>changeTheme(name)</code></p>
</a></h4>

**The `changeTheme` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="settingservice-init-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html#init"><p><code>init(options?, settingData?, integrations?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param        | Type                                                                                                                                           | Description |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| options      | <code><a href="https://ngx-useful.lamnhan.com/docs/content/interfaces/settingoptions.html" target="_blank">SettingOptions</a></code>           |             |
| settingData  | <code><a href="https://ngx-useful.lamnhan.com/docs/content/interfaces/builtindata.html" target="_blank">BuiltinData</a></code>                 |             |
| integrations | <code><a href="https://ngx-useful.lamnhan.com/docs/content/interfaces/settingintegrations.html" target="_blank">SettingIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/docs/content/classes/settingservice.html" target="_blank">SettingService</a></code>

---

</section>
