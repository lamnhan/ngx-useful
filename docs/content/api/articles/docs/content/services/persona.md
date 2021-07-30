<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="personaservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html"><p>The <code>PersonaService</code> class</p>
</a></h2>

**The `PersonaService` class.**

<h3><a name="personaservice-properties"><p>PersonaService properties</p>
</a></h3>

| Name                                                                                                  | Type                                                                                                                                            | Description |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [data](https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#data)             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#personadata" target="_blank">PersonaData</a></code>                |             |
| [menu](https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#menu)             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/menuitem.html" target="_blank">MenuItem</a>[]</code>                 |             |
| [menu2nd](https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#menu2nd)       | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/menuitem.html" target="_blank">MenuItem</a>[]</code>                 |             |
| [name](https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#name)             | <code>string</code>                                                                                                                             |             |
| [properties](https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#properties) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/personaproperties.html" target="_blank">PersonaProperties</a></code> |             |
| [tabs](https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#tabs)             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/menuitem.html" target="_blank">MenuItem</a>[]</code>                 |             |

<h3><a name="personaservice-methods"><p>PersonaService methods</p>
</a></h3>

| Function                                                           | Returns type                                                                                                                           | Description |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [get(key, withPersona?)](#personaservice-get-0)                    | <code>unknown</code>                                                                                                                   |             |
| [init(data)](#personaservice-init-0)                               | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code> |             |
| [setActions(personaActions)](#personaservice-setactions-0)         | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code> |             |
| [setIntegrations(integrations)](#personaservice-setintegrations-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code> |             |
| [setMenuRegistry(menuRegistry)](#personaservice-setmenuregistry-0) | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code> |             |
| [setOptions(options)](#personaservice-setoptions-0)                | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code> |             |

<h4><a name="personaservice-get-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#get"><p><code>get(key, withPersona?)</code></p>
</a></h4>

**The `get` call signature.**

**Parameters**

| Param       | Type                             | Description |
| ----------- | -------------------------------- | ----------- |
| **key**     | <code>string</code>              |             |
| withPersona | <code>undefined \| string</code> |             |

**Returns**

<code>unknown</code>

---

<h4><a name="personaservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#init"><p><code>init(data)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param    | Type                                                                                                                             | Description |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **data** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#personadata" target="_blank">PersonaData</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code>

---

<h4><a name="personaservice-setactions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#setactions"><p><code>setActions(personaActions)</code></p>
</a></h4>

**The `setActions` call signature.**

**Parameters**

| Param              | Type                                       | Description |
| ------------------ | ------------------------------------------ | ----------- |
| **personaActions** | <code>Record<string, PersonaAction></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code>

---

<h4><a name="personaservice-setintegrations-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#setintegrations"><p><code>setIntegrations(integrations)</code></p>
</a></h4>

**The `setIntegrations` call signature.**

**Parameters**

| Param            | Type                                                                                                                                                | Description |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **integrations** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/personaintegrations.html" target="_blank">PersonaIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code>

---

<h4><a name="personaservice-setmenuregistry-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#setmenuregistry"><p><code>setMenuRegistry(menuRegistry)</code></p>
</a></h4>

**The `setMenuRegistry` call signature.**

**Parameters**

| Param            | Type                                  | Description |
| ---------------- | ------------------------------------- | ----------- |
| **menuRegistry** | <code>Record<string, MenuItem></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code>

---

<h4><a name="personaservice-setoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html#setoptions"><p><code>setOptions(options)</code></p>
</a></h4>

**The `setOptions` call signature.**

**Parameters**

| Param       | Type                                                                                                                                      | Description |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **options** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/personaoptions.html" target="_blank">PersonaOptions</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html" target="_blank">PersonaService</a></code>

---

</section>
