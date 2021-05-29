<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @lamnhan/ngx-useful

**A collection of helpful Angular services, pipes, ....**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Getting started](#getting-started)
- [Modules](#modules)
- [Components](#components)
- [Services](#services)
- [Pipes](#pipes)
- [Detail API reference](https://ngx-useful.lamnhan.com/content/reference)


</section>

<section id="getting-started">

## Getting started

Install ngx-useful:

```sh
npm install --save @lamnhan/ngx-useful@0.0.8
```

You may also want to install [@lamnhan/unistylus](https://unistylus.lamnhan.com).

Basic usage, three steps to use a service:

```ts
// 1. provide services in ---> app.module.ts
{ ..., providers: [AppService], ... }

// 2. init services in ---> app.component.ts
this.appService.init(...);

// 3. inject where needed
constructor(private appService: AppService) {}
```

See [guides](https://ngx-useful.lamnhan.com/guides) for more articles. Also see the list of: [services](https://ngx-useful.lamnhan.com/services), [pipes](https://ngx-useful.lamnhan.com/pipes), [directives](https://ngx-useful.lamnhan.com/directives), [guards](https://ngx-useful.lamnhan.com/guards).

</section>

<section id="modules" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="modules"><p>Modules</p>
</a></h2>

| Class                                                                                                                                    | Description |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [RouterExternalActiveDirectiveModule](https://ngx-useful.lamnhan.com/content/reference/classes/routerexternalactivedirectivemodule.html) |             |
| [RouterLinkDirectiveModule](https://ngx-useful.lamnhan.com/content/reference/classes/routerlinkdirectivemodule.html)                     |             |
| [SchemataModule](https://ngx-useful.lamnhan.com/content/reference/classes/schematamodule.html)                                           |             |
| [UsefulModule](https://ngx-useful.lamnhan.com/content/reference/classes/usefulmodule.html)                                               |             |

</section>

<section id="components" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="components"><p>Components</p>
</a></h2>

</section>

<section id="services" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="services"><p>Services</p>
</a></h2>

| Class                                                                                                    | Description                                   |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [AppService](https://ngx-useful.lamnhan.com/content/reference/classes/appservice.html)                   | General app related methods                   |
| [AuthService](https://ngx-useful.lamnhan.com/content/reference/classes/authservice.html)                 |                                               |
| [AuthorDataService](https://ngx-useful.lamnhan.com/content/reference/classes/authordataservice.html)     |                                               |
| [CacheService](https://ngx-useful.lamnhan.com/content/reference/classes/cacheservice.html)               |                                               |
| [CartService](https://ngx-useful.lamnhan.com/content/reference/classes/cartservice.html)                 | (DON'T USE YET) Shopping cart related actions |
| [CategoryDataService](https://ngx-useful.lamnhan.com/content/reference/classes/categorydataservice.html) |                                               |
| [CurrencyService](https://ngx-useful.lamnhan.com/content/reference/classes/currencyservice.html)         | (DON'T USE YET) Currency service              |
| [DatabaseService](https://ngx-useful.lamnhan.com/content/reference/classes/databaseservice.html)         |                                               |
| [DateService](https://ngx-useful.lamnhan.com/content/reference/classes/dateservice.html)                 | (DON'T USE YET) Date service                  |
| [ErrorService](https://ngx-useful.lamnhan.com/content/reference/classes/errorservice.html)               |                                               |
| [FetchService](https://ngx-useful.lamnhan.com/content/reference/classes/fetchservice.html)               |                                               |
| [HelperService](https://ngx-useful.lamnhan.com/content/reference/classes/helperservice.html)             |                                               |
| [LocalstorageService](https://ngx-useful.lamnhan.com/content/reference/classes/localstorageservice.html) |                                               |
| [MetaDataService](https://ngx-useful.lamnhan.com/content/reference/classes/metadataservice.html)         |                                               |
| [MetaService](https://ngx-useful.lamnhan.com/content/reference/classes/metaservice.html)                 |                                               |
| [NavService](https://ngx-useful.lamnhan.com/content/reference/classes/navservice.html)                   | Advanced navigation                           |
| [NetworkService](https://ngx-useful.lamnhan.com/content/reference/classes/networkservice.html)           |                                               |
| [NotifyService](https://ngx-useful.lamnhan.com/content/reference/classes/notifyservice.html)             | (DON'T USE YET) Notify service                |
| [OptionDataService](https://ngx-useful.lamnhan.com/content/reference/classes/optiondataservice.html)     |                                               |
| [PageDataService](https://ngx-useful.lamnhan.com/content/reference/classes/pagedataservice.html)         |                                               |
| [PersonaService](https://ngx-useful.lamnhan.com/content/reference/classes/personaservice.html)           |                                               |
| [PlayerService](https://ngx-useful.lamnhan.com/content/reference/classes/playerservice.html)             |                                               |
| [PostDataService](https://ngx-useful.lamnhan.com/content/reference/classes/postdataservice.html)         |                                               |
| [ProfileDataService](https://ngx-useful.lamnhan.com/content/reference/classes/profiledataservice.html)   |                                               |
| [PwaService](https://ngx-useful.lamnhan.com/content/reference/classes/pwaservice.html)                   |                                               |
| [SettingService](https://ngx-useful.lamnhan.com/content/reference/classes/settingservice.html)           |                                               |
| [TagDataService](https://ngx-useful.lamnhan.com/content/reference/classes/tagdataservice.html)           |                                               |
| [UserDataService](https://ngx-useful.lamnhan.com/content/reference/classes/userdataservice.html)         |                                               |
| [UserService](https://ngx-useful.lamnhan.com/content/reference/classes/userservice.html)                 |                                               |

</section>

<section id="pipes" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="pipes"><p>Pipes</p>
</a></h2>

| Class                                                                                        | Description                                    |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [AgoPipe](https://ngx-useful.lamnhan.com/content/reference/classes/agopipe.html)             |                                                |
| [AuthorPipe](https://ngx-useful.lamnhan.com/content/reference/classes/authorpipe.html)       |                                                |
| [CategoryPipe](https://ngx-useful.lamnhan.com/content/reference/classes/categorypipe.html)   |                                                |
| [CurrencyxPipe](https://ngx-useful.lamnhan.com/content/reference/classes/currencyxpipe.html) |                                                |
| [DatexPipe](https://ngx-useful.lamnhan.com/content/reference/classes/datexpipe.html)         |                                                |
| [FilterPipe](https://ngx-useful.lamnhan.com/content/reference/classes/filterpipe.html)       |                                                |
| [ListPipe](https://ngx-useful.lamnhan.com/content/reference/classes/listpipe.html)           |                                                |
| [O1iPipe](https://ngx-useful.lamnhan.com/content/reference/classes/o1ipipe.html)             | Select the 1st item in an object               |
| [O2aPipe](https://ngx-useful.lamnhan.com/content/reference/classes/o2apipe.html)             | Turn an object of items into an array          |
| [PagePipe](https://ngx-useful.lamnhan.com/content/reference/classes/pagepipe.html)           |                                                |
| [PostPipe](https://ngx-useful.lamnhan.com/content/reference/classes/postpipe.html)           |                                                |
| [ProfilePipe](https://ngx-useful.lamnhan.com/content/reference/classes/profilepipe.html)     |                                                |
| [SafePipe](https://ngx-useful.lamnhan.com/content/reference/classes/safepipe.html)           | Mark an url or a HTML content as safe from XSS |
| [TagPipe](https://ngx-useful.lamnhan.com/content/reference/classes/tagpipe.html)             |                                                |

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@lamnhan/ngx-useful** is released under the [MIT](https://github.com/lamnhan/ngx-useful/blob/master/LICENSE) license.

</section>
