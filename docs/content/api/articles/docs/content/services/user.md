<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="userservice" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html"><p>The <code>UserService</code> class</p>
</a></h2>

**The `UserService` class.**

<h3><a name="userservice-properties"><p>UserService properties</p>
</a></h3>

| Name                                                                                                     | Type                                                                                                                           | Description |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [currentUser](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#currentuser)     | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#nativeuser" target="_blank">NativeUser</a></code> |             |
| [data](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#data)                   | <code>User</code>                                                                                                              |             |
| [level](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#level)                 | <code>number</code>                                                                                                            |             |
| [onUserChanged](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#onuserchanged) | <code>ReplaySubject<undefined \| User></code>                                                                                  |             |
| [publicData](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#publicdata)       | <code>Profile</code>                                                                                                           |             |
| [role](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#role)                   | <code>UserRole</code>                                                                                                          |             |
| [uid](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#uid)                     | <code>undefined \| string</code>                                                                                               |             |
| [username](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#username)           | <code>undefined \| string</code>                                                                                               |             |

<h3><a name="userservice-methods"><p>UserService methods</p>
</a></h3>

| Function                                                                     | Returns type                                                                                                                                     | Description |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| [allowedLevel(atLeast)](#userservice-allowedlevel-0)                         | <code>boolean</code>                                                                                                                             |             |
| [changePublicity(toPublic?)](#userservice-changepublicity-0)                 | <code>Observable<boolean></code>                                                                                                                 |             |
| [checkUsernameExists(username)](#userservice-checkusernameexists-0)          | <code>Observable<boolean></code>                                                                                                                 |             |
| [getBadging(name)](#userservice-getbadging-0)                                | <code>undefined \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/userbadging.html" target="_blank">UserBadging</a></code> |             |
| [getBadgingRegistry()](#userservice-getbadgingregistry-0)                    | <code>Record<string, UserBadging></code>                                                                                                         |             |
| [getRanking(name)](#userservice-getranking-0)                                | <code>undefined \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/userranking.html" target="_blank">UserRanking</a></code> |             |
| [getRankingRegistry()](#userservice-getrankingregistry-0)                    | <code>Record<string, UserRanking></code>                                                                                                         |             |
| [getRoleing(name)](#userservice-getroleing-0)                                | <code>undefined \| <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/userroleing.html" target="_blank">UserRoleing</a></code> |             |
| [getRoleingRegistry()](#userservice-getroleingregistry-0)                    | <code>Record<string, UserRoleing></code>                                                                                                         |             |
| [init(userDataService, profileDataService)](#userservice-init-0)             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html" target="_blank">UserService</a></code>                 |             |
| [removeCoverPhoto()](#userservice-removecoverphoto-0)                        | <code>Observable<[boolean, boolean]></code>                                                                                                      |             |
| [setOptions(options)](#userservice-setoptions-0)                             | <code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html" target="_blank">UserService</a></code>                 |             |
| [updateAdditionalData(data, publicly?)](#userservice-updateadditionaldata-0) | <code>Observable<undefined \| false \| true></code>                                                                                              |             |
| [updateAddresses(addresses)](#userservice-updateaddresses-0)                 | <code>Observable<boolean></code>                                                                                                                 |             |
| [updateProfile(data)](#userservice-updateprofile-0)                          | <code>Observable<[void, undefined \| false \| true, undefined \| false \| true]></code>                                                          |             |
| [updatePublicly(publicly)](#userservice-updatepublicly-0)                    | <code>Observable<boolean></code>                                                                                                                 |             |
| [updateSettings(settings)](#userservice-updatesettings-0)                    | <code>Observable<boolean></code>                                                                                                                 |             |
| [verifyEmail()](#userservice-verifyemail-0)                                  | <code>Observable<void></code>                                                                                                                    |             |

<h4><a name="userservice-allowedlevel-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#allowedlevel"><p><code>allowedLevel(atLeast)</code></p>
</a></h4>

**The `allowedLevel` call signature.**

**Parameters**

| Param       | Type                | Description |
| ----------- | ------------------- | ----------- |
| **atLeast** | <code>number</code> |             |

**Returns**

<code>boolean</code>

---

<h4><a name="userservice-changepublicity-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#changepublicity"><p><code>changePublicity(toPublic?)</code></p>
</a></h4>

**The `changePublicity` call signature.**

**Parameters**

| Param    | Type                 | Description |
| -------- | -------------------- | ----------- |
| toPublic | <code>boolean</code> |             |

**Returns**

<code>Observable<boolean></code>

---

<h4><a name="userservice-checkusernameexists-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#checkusernameexists"><p><code>checkUsernameExists(username)</code></p>
</a></h4>

**The `checkUsernameExists` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **username** | <code>string</code> |             |

**Returns**

<code>Observable<boolean></code>

---

<h4><a name="userservice-getbadging-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#getbadging"><p><code>getBadging(name)</code></p>
</a></h4>

**The `getBadging` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>undefined | <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/userbadging.html" target="_blank">UserBadging</a></code>

---

<h4><a name="userservice-getbadgingregistry-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#getbadgingregistry"><p><code>getBadgingRegistry()</code></p>
</a></h4>

**The `getBadgingRegistry` call signature.**

**Returns**

<code>Record<string, UserBadging></code>

---

<h4><a name="userservice-getranking-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#getranking"><p><code>getRanking(name)</code></p>
</a></h4>

**The `getRanking` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>undefined | <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/userranking.html" target="_blank">UserRanking</a></code>

---

<h4><a name="userservice-getrankingregistry-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#getrankingregistry"><p><code>getRankingRegistry()</code></p>
</a></h4>

**The `getRankingRegistry` call signature.**

**Returns**

<code>Record<string, UserRanking></code>

---

<h4><a name="userservice-getroleing-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#getroleing"><p><code>getRoleing(name)</code></p>
</a></h4>

**The `getRoleing` call signature.**

**Parameters**

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| **name** | <code>string</code> |             |

**Returns**

<code>undefined | <a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/userroleing.html" target="_blank">UserRoleing</a></code>

---

<h4><a name="userservice-getroleingregistry-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#getroleingregistry"><p><code>getRoleingRegistry()</code></p>
</a></h4>

**The `getRoleingRegistry` call signature.**

**Returns**

<code>Record<string, UserRoleing></code>

---

<h4><a name="userservice-init-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#init"><p><code>init(userDataService, profileDataService)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param                  | Type                                                                                                                                           | Description |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **userDataService**    | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#userdataservice" target="_blank">UserDataService</a></code>       |             |
| **profileDataService** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/globals.html#profiledataservice" target="_blank">ProfileDataService</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html" target="_blank">UserService</a></code>

---

<h4><a name="userservice-removecoverphoto-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#removecoverphoto"><p><code>removeCoverPhoto()</code></p>
</a></h4>

**The `removeCoverPhoto` call signature.**

**Returns**

<code>Observable<[boolean, boolean]></code>

---

<h4><a name="userservice-setoptions-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#setoptions"><p><code>setOptions(options)</code></p>
</a></h4>

**The `setOptions` call signature.**

**Parameters**

| Param       | Type                                                                                                                                | Description |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **options** | <code><a href="https://ngx-useful.lamnhan.com/content/reference/interfaces/useroptions.html" target="_blank">UserOptions</a></code> |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html" target="_blank">UserService</a></code>

---

<h4><a name="userservice-updateadditionaldata-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#updateadditionaldata"><p><code>updateAdditionalData(data, publicly?)</code></p>
</a></h4>

**The `updateAdditionalData` call signature.**

**Parameters**

| Param    | Type                                 | Description |
| -------- | ------------------------------------ | ----------- |
| **data** | <code>Record<string, unknown></code> |             |
| publicly | <code>Record<string, boolean></code> |             |

**Returns**

<code>Observable<undefined | false | true></code>

---

<h4><a name="userservice-updateaddresses-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#updateaddresses"><p><code>updateAddresses(addresses)</code></p>
</a></h4>

**The `updateAddresses` call signature.**

**Parameters**

| Param         | Type                       | Description |
| ------------- | -------------------------- | ----------- |
| **addresses** | <code>UserAddress[]</code> |             |

**Returns**

<code>Observable<boolean></code>

---

<h4><a name="userservice-updateprofile-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#updateprofile"><p><code>updateProfile(data)</code></p>
</a></h4>

**The `updateProfile` call signature.**

**Parameters**

| Param    | Type                                               | Description |
| -------- | -------------------------------------------------- | ----------- |
| **data** | <code>UserEditableProfile & object & object</code> |             |

**Returns**

<code>Observable<[void, undefined | false | true, undefined | false | true]></code>

---

<h4><a name="userservice-updatepublicly-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#updatepublicly"><p><code>updatePublicly(publicly)</code></p>
</a></h4>

**The `updatePublicly` call signature.**

**Parameters**

| Param        | Type                      | Description |
| ------------ | ------------------------- | ----------- |
| **publicly** | <code>UserPublicly</code> |             |

**Returns**

<code>Observable<boolean></code>

---

<h4><a name="userservice-updatesettings-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#updatesettings"><p><code>updateSettings(settings)</code></p>
</a></h4>

**The `updateSettings` call signature.**

**Parameters**

| Param        | Type                      | Description |
| ------------ | ------------------------- | ----------- |
| **settings** | <code>UserSettings</code> |             |

**Returns**

<code>Observable<boolean></code>

---

<h4><a name="userservice-verifyemail-0" href="https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html#verifyemail"><p><code>verifyEmail()</code></p>
</a></h4>

**The `verifyEmail` call signature.**

**Returns**

<code>Observable<void></code>

---

</section>
