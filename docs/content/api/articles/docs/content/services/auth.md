<section id="main" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="authservice" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html"><p>The <code>AuthService</code> class</p>
</a></h2>

**The `AuthService` class.**

<h3><a name="authservice-properties"><p>AuthService properties</p>
</a></h3>

| Name                                                                                                                                | Type                                                                                                                                          | Description |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [authenticated](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#authenticated)                                 | <code>undefined \| false \| true</code>                                                                                                       |             |
| [credential](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#credential)                                       | <code><a href="https://ngx-useful.lamnhan.com/docs/content/globals.html#nativeusercredential" target="_blank">NativeUserCredential</a></code> |             |
| [driver](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#driver)                                               | <code>string</code>                                                                                                                           |             |
| [methodAllowedForEmailPassword](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#methodallowedforemailpassword) | <code>boolean</code>                                                                                                                          |             |
| [methodAllowedForFacebook](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#methodallowedforfacebook)           | <code>boolean</code>                                                                                                                          |             |
| [methodAllowedForGithub](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#methodallowedforgithub)               | <code>boolean</code>                                                                                                                          |             |
| [methodAllowedForGoogle](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#methodallowedforgoogle)               | <code>boolean</code>                                                                                                                          |             |
| [onAuthStateChanged](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#onauthstatechanged)                       | <code>ReplaySubject<null \| User></code>                                                                                                      |             |
| [redirectUrl](https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#redirecturl)                                     | <code>null \| string</code>                                                                                                                   |             |

<h3><a name="authservice-methods"><p>AuthService methods</p>
</a></h3>

| Function                                                                                                       | Returns type                                                                                                                | Description |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [createUserWithEmailAndPassword(email, password)](#authservice-createuserwithemailandpassword-0)               | <code>Observable<UserCredential></code>                                                                                     |             |
| [handleAccountExistsWithDifferentCredential(email)](#authservice-handleaccountexistswithdifferentcredential-0) | <code>Observable<string[]></code>                                                                                           |             |
| [init(service, options?)](#authservice-init-0)                                                                 | <code><a href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html" target="_blank">AuthService</a></code> |             |
| [sendPasswordResetEmail(email)](#authservice-sendpasswordresetemail-0)                                         | <code>Observable<void></code>                                                                                               |             |
| [setRedirectUrl(url)](#authservice-setredirecturl-0)                                                           | <code>void</code>                                                                                                           |             |
| [signInWithEmailAndPassword(email, password)](#authservice-signinwithemailandpassword-0)                       | <code>Observable<UserCredential></code>                                                                                     |             |
| [signInWithPopupForFacebook()](#authservice-signinwithpopupforfacebook-0)                                      | <code>Observable<UserCredential></code>                                                                                     |             |
| [signInWithPopupForGithub()](#authservice-signinwithpopupforgithub-0)                                          | <code>Observable<UserCredential></code>                                                                                     |             |
| [signInWithPopupForGoogle()](#authservice-signinwithpopupforgoogle-0)                                          | <code>Observable<UserCredential></code>                                                                                     |             |
| [signOut()](#authservice-signout-0)                                                                            | <code>Observable<void></code>                                                                                               |             |

<h4><a name="authservice-createuserwithemailandpassword-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#createuserwithemailandpassword"><p><code>createUserWithEmailAndPassword(email, password)</code></p>
</a></h4>

**The `createUserWithEmailAndPassword` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **email**    | <code>string</code> |             |
| **password** | <code>string</code> |             |

**Returns**

<code>Observable<UserCredential></code>

---

<h4><a name="authservice-handleaccountexistswithdifferentcredential-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#handleaccountexistswithdifferentcredential"><p><code>handleAccountExistsWithDifferentCredential(email)</code></p>
</a></h4>

**The `handleAccountExistsWithDifferentCredential` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **email** | <code>string</code> |             |

**Returns**

<code>Observable<string[]></code>

---

<h4><a name="authservice-init-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#init"><p><code>init(service, options?)</code></p>
</a></h4>

**The `init` call signature.**

**Parameters**

| Param       | Type                                                                                                                                    | Description |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **service** | <code><a href="https://ngx-useful.lamnhan.com/docs/content/globals.html#vendorauthservice" target="_blank">VendorAuthService</a></code> |             |
| options     | <code><a href="https://ngx-useful.lamnhan.com/docs/content/interfaces/authoptions.html" target="_blank">AuthOptions</a></code>          |             |

**Returns**

<code><a href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html" target="_blank">AuthService</a></code>

---

<h4><a name="authservice-sendpasswordresetemail-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#sendpasswordresetemail"><p><code>sendPasswordResetEmail(email)</code></p>
</a></h4>

**The `sendPasswordResetEmail` call signature.**

**Parameters**

| Param     | Type                | Description |
| --------- | ------------------- | ----------- |
| **email** | <code>string</code> |             |

**Returns**

<code>Observable<void></code>

---

<h4><a name="authservice-setredirecturl-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#setredirecturl"><p><code>setRedirectUrl(url)</code></p>
</a></h4>

**The `setRedirectUrl` call signature.**

**Parameters**

| Param   | Type                        | Description |
| ------- | --------------------------- | ----------- |
| **url** | <code>null \| string</code> |             |

**Returns**

<code>void</code>

---

<h4><a name="authservice-signinwithemailandpassword-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#signinwithemailandpassword"><p><code>signInWithEmailAndPassword(email, password)</code></p>
</a></h4>

**The `signInWithEmailAndPassword` call signature.**

**Parameters**

| Param        | Type                | Description |
| ------------ | ------------------- | ----------- |
| **email**    | <code>string</code> |             |
| **password** | <code>string</code> |             |

**Returns**

<code>Observable<UserCredential></code>

---

<h4><a name="authservice-signinwithpopupforfacebook-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#signinwithpopupforfacebook"><p><code>signInWithPopupForFacebook()</code></p>
</a></h4>

**The `signInWithPopupForFacebook` call signature.**

**Returns**

<code>Observable<UserCredential></code>

---

<h4><a name="authservice-signinwithpopupforgithub-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#signinwithpopupforgithub"><p><code>signInWithPopupForGithub()</code></p>
</a></h4>

**The `signInWithPopupForGithub` call signature.**

**Returns**

<code>Observable<UserCredential></code>

---

<h4><a name="authservice-signinwithpopupforgoogle-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#signinwithpopupforgoogle"><p><code>signInWithPopupForGoogle()</code></p>
</a></h4>

**The `signInWithPopupForGoogle` call signature.**

**Returns**

<code>Observable<UserCredential></code>

---

<h4><a name="authservice-signout-0" href="https://ngx-useful.lamnhan.com/docs/content/classes/authservice.html#signout"><p><code>signOut()</code></p>
</a></h4>

**The `signOut` call signature.**

**Returns**

<code>Observable<void></code>

---

</section>
