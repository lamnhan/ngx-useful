<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="userservice" href="https://ngx-useful.lamnhan.com/classes/userservice.html"><p>The <code>UserService</code> class</p>
</a></h2>

**The `UserService` class.**

<h3><a name="userservice-properties"><p>UserService properties</p>
</a></h3>

| Name                                                                                   | Type                                                                                                         | Description |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------- |
| [currentUser](https://ngx-useful.lamnhan.com/classes/userservice.html#currentuser)     | <code><a href="https://ngx-useful.lamnhan.com/globals.html#nativeuser" target="_blank">NativeUser</a></code> |             |
| [data](https://ngx-useful.lamnhan.com/classes/userservice.html#data)                   | <code>User</code>                                                                                            |             |
| [level](https://ngx-useful.lamnhan.com/classes/userservice.html#level)                 | <code>number</code>                                                                                          |             |
| [onUserChanged](https://ngx-useful.lamnhan.com/classes/userservice.html#onuserchanged) | <code>ReplaySubject<undefined \| User></code>                                                                |             |
| [publicData](https://ngx-useful.lamnhan.com/classes/userservice.html#publicdata)       | <code>Profile</code>                                                                                         |             |
| [role](https://ngx-useful.lamnhan.com/classes/userservice.html#role)                   | <code>string</code>                                                                                          |             |
| [uid](https://ngx-useful.lamnhan.com/classes/userservice.html#uid)                     | <code>undefined \| string</code>                                                                             |             |
| [username](https://ngx-useful.lamnhan.com/classes/userservice.html#username)           | <code>undefined \| string</code>                                                                             |             |

<h3><a name="userservice-methods"><p>UserService methods</p>
</a></h3>

| Function                                                                     | Returns type                                                                                                   | Description |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------- |
| [allowedLevel(atLeast)](#userservice-allowedlevel-0)                         | <code>boolean</code>                                                                                           |             |
| [changeEmail(email)](#userservice-changeemail-0)                             | <code>void</code>                                                                                              |             |
| [changePhoneNumber(phoneNumber)](#userservice-changephonenumber-0)           | <code>void</code>                                                                                              |             |
| [changePublicity(toPublic?)](#userservice-changepublicity-0)                 | <code>Observable<never></code>                                                                                 |             |
| [changeUsername(username)](#userservice-changeusername-0)                    | <code>Observable<object></code>                                                                                |             |
| [checkUsernameExists(username)](#userservice-checkusernameexists-0)          | <code>Observable<boolean></code>                                                                               |             |
| [init(userDataService, options?, integrations?)](#userservice-init-0)        | <code><a href="https://ngx-useful.lamnhan.com/classes/userservice.html" target="_blank">UserService</a></code> |             |
| [updateAdditionalData(data, publicly?)](#userservice-updateadditionaldata-0) | <code>Observable<void></code>                                                                                  |             |
| [updateAddresses(addresses)](#userservice-updateaddresses-0)                 | <code>Observable<void></code>                                                                                  |             |
| [updateProfile(data)](#userservice-updateprofile-0)                          | <code>Observable<[void, void, void]></code>                                                                    |             |
| [updatePublicly(publicly)](#userservice-updatepublicly-0)                    | <code>Observable<void></code>                                                                                  |             |
| [updateSettings(settings)](#userservice-updatesettings-0)                    | <code>Observable<void></code>                                                                                  |             |

<h4><a name="userservice-allowedlevel-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#allowedlevel"><p><code>allowedLevel(atLeast)</code></p>
</a></h4>

**The `allowedLevel` call signature.**

**Parameters**

| Param       | Type                | Description |
| ----------- | ------------------- | ----------- |
| **atLeast** | <code>number</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="userservice-changeemail-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#changeemail"><p><code>changeEmail(email)</code></p>
</a></h4>

**The `changeEmail` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **email** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="userservice-changephonenumber-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#changephonenumber"><p><code>changePhoneNumber(phoneNumber)</code></p>
</a></h4>

**The `changePhoneNumber` call signature.**

**Parameters**

| Param           | Type                | Description |
| --------------- | ------------------- | ----------- |
| **phoneNumber** | <code>string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="userservice-changepublicity-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#changepublicity"><p><code>changePublicity(toPublic?)</code></p>
</a></h4>

**The `changePublicity` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| toPublic | <code>boolean</code> |             |

**Returns**

<code>Observable<never></code>

---

<h4><a name="userservice-changeusername-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#changeusername"><p><code>changeUsername(username)</code></p>
</a></h4>

**The `changeUsername` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **username** | <code>string</code> |             |

**Returns**

<code>Observable<object></code>

---

<h4><a name="userservice-checkusernameexists-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#checkusernameexists"><p><code>checkUsernameExists(username)</code></p>
</a></h4>

**The `checkUsernameExists` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **username** | <code>string</code> |             |

**Returns**

<code>Observable<boolean></code>

---

<h4><a name="userservice-init-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#init"><p><code>init(userDataService, options?, integrations?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param               | Type                                                                                                                        | Description |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **userDataService** | <code><a href="https://ngx-useful.lamnhan.com/classes/userdataservice.html" target="_blank">UserDataService</a></code>      |             |
| options             | <code><a href="https://ngx-useful.lamnhan.com/interfaces/useroptions.html" target="_blank">UserOptions</a></code>           |             |
| integrations        | <code><a href="https://ngx-useful.lamnhan.com/interfaces/userintegrations.html" target="_blank">UserIntegrations</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/classes/userservice.html" target="_blank">UserService</a></code>

---

<h4><a name="userservice-updateadditionaldata-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#updateadditionaldata"><p><code>updateAdditionalData(data, publicly?)</code></p>
</a></h4>

**The `updateAdditionalData` call signature.**

**Parameters**

| Param    | Type                                 | Description |
| -------- | ------------------------------------ | ----------- |
| **data** | <code>Record<string, unknown></code> |             |
| publicly | <code>Record<string, boolean></code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="userservice-updateaddresses-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#updateaddresses"><p><code>updateAddresses(addresses)</code></p>
</a></h4>

**The `updateAddresses` call signature.**

**Parameters**

| Param         | Type                                     | Description |
| ------------- | ---------------------------------------- | ----------- |
| **addresses** | <code>Record<string, UserAddress></code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="userservice-updateprofile-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#updateprofile"><p><code>updateProfile(data)</code></p>
</a></h4>

**The `updateProfile` call signature.**

**Parameters**

| Param    | Type                             | Description |
| -------- | -------------------------------- | ----------- |
| **data** | <code>UserEditableProfile</code> |             |

**Returns**

<code>Observable<[void, void, void]></code>

---

<h4><a name="userservice-updatepublicly-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#updatepublicly"><p><code>updatePublicly(publicly)</code></p>
</a></h4>

**The `updatePublicly` call signature.**

**Parameters**

| Param        | Type                      | Description |
| ------------ | ------------------------- | ----------- |
| **publicly** | <code>UserPublicly</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="userservice-updatesettings-0" href="https://ngx-useful.lamnhan.com/classes/userservice.html#updatesettings"><p><code>updateSettings(settings)</code></p>
</a></h4>

**The `updateSettings` call signature.**

**Parameters**

| Param        | Type                      | Description |
| ------------ | ------------------------- | ----------- |
| **settings** | <code>UserSettings</code> |             |

**Returns**

<code>Observable<void></code>

---

</section>
