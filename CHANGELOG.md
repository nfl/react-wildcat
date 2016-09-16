<a name="5.0.0"></a>
# [5.0.0](https://github.com/nfl/react-wildcat/compare/4.5.0...v5.0.0) (2016-09-07)


### Performance Improvements

* **react-wildcat:** Update jspm to fix potential memory leak ([#153](https://github.com/nfl/react-wildcat/issues/153)) ([1046346](https://github.com/nfl/react-wildcat/commit/1046346))



<a name="4.5.0"></a>
# [4.5.0](https://github.com/nfl/react-wildcat/compare/4.4.1...v4.5.0) (2016-08-08)


### Bug Fixes

* **react-wildcat-prefetch:** Check for existence of key before returning an undefined value. ([af1a1d9](https://github.com/nfl/react-wildcat/commit/af1a1d9))


### Features

* **react-wildcat-prefetch:** Allow users to define custom initial data keys ([b25cb51](https://github.com/nfl/react-wildcat/commit/b25cb51))



<a name="4.4.1"></a>
## [4.4.1](https://github.com/nfl/react-wildcat/compare/4.4.0...v4.4.1) (2016-07-27)


### Bug Fixes

* **react-wildcat-handoff:** Fix initializing an IndexedDB cache in Firefox ([#141](https://github.com/nfl/react-wildcat/issues/141)) ([99cddef](https://github.com/nfl/react-wildcat/commit/99cddef)), closes [#141](https://github.com/nfl/react-wildcat/issues/141)
* **react-wildcat-handoff:** Resolve multiple subdomains correctly ([#147](https://github.com/nfl/react-wildcat/issues/147)) ([024b5d4](https://github.com/nfl/react-wildcat/commit/024b5d4)), closes [#147](https://github.com/nfl/react-wildcat/issues/147)



<a name="4.4.0"></a>
# [4.4.0](https://github.com/nfl/react-wildcat/compare/4.3.1...v4.4.0) (2016-07-22)


### Features

* **react-wildcat-handoff:** Ability to alias by subdomain ([#146](https://github.com/nfl/react-wildcat/issues/146)) ([6221547](https://github.com/nfl/react-wildcat/commit/6221547))



<a name="4.3.1"></a>
## [4.3.1](https://github.com/nfl/react-wildcat/compare/4.3.0...v4.3.1) (2016-07-18)


### Bug Fixes

* **react-wildcat-handoff:** Replace arrow functions with named callbacks. ([9dd5f5f](https://github.com/nfl/react-wildcat/commit/9dd5f5f))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/nfl/react-wildcat/compare/4.2.0...v4.3.0) (2016-07-13)


### Features

* **react-wildcat-handoff:** Add support for domain aliases ([#144](https://github.com/nfl/react-wildcat/issues/144)) ([249afcd](https://github.com/nfl/react-wildcat/commit/249afcd))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/nfl/react-wildcat/compare/4.1.0...v4.2.0) (2016-06-27)


### Bug Fixes

* **react-wildcat-handoff:** Add cookie and referrer data support ([#139](https://github.com/nfl/react-wildcat/issues/139)) ([507611f](https://github.com/nfl/react-wildcat/commit/507611f))
* **react-wildcat-handoff:** Add development-specific TLDs ([#137](https://github.com/nfl/react-wildcat/issues/137)) ([7d15c64](https://github.com/nfl/react-wildcat/commit/7d15c64))


### Features

* **example:** Add service worker caching to the example project ([#135](https://github.com/nfl/react-wildcat/issues/135)) ([9f9fa1e](https://github.com/nfl/react-wildcat/commit/9f9fa1e))


### Performance Improvements

* **example:** Move React into separate bundle. ([#134](https://github.com/nfl/react-wildcat/issues/134)) ([7176a4d](https://github.com/nfl/react-wildcat/commit/7176a4d))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/nfl/react-wildcat/compare/4.0.0...v4.1.0) (2016-05-24)


### Bug Fixes

* **react-wildcat-handoff:** Fix default __INITIAL_DATA__ value ([#131](https://github.com/nfl/react-wildcat/issues/131)) ([4834f4f](https://github.com/nfl/react-wildcat/commit/4834f4f)), closes [#131](https://github.com/nfl/react-wildcat/issues/131)


### Features

* react@15.1.0 ([8de05f2](https://github.com/nfl/react-wildcat/commit/8de05f2))


### Performance Improvements

* Update dependency references and reduce number of calls to System.registerDynamic ([#132](https://github.com/nfl/react-wildcat/issues/132)) ([92acd66](https://github.com/nfl/react-wildcat/commit/92acd66))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/nfl/react-wildcat/compare/3.2.0...v4.0.0) (2016-05-11)


### Bug Fixes

* Add babel-plugin-react-transform as a dependency([8615b8a](https://github.com/nfl/react-wildcat/commit/8615b8a))
* Add format type for bundles and remove deprecated setting([5b315a6](https://github.com/nfl/react-wildcat/commit/5b315a6))
* Remove hard-coded meta([9b89f27](https://github.com/nfl/react-wildcat/commit/9b89f27))
* Use es5 functions for legacy platforms.([9925ed7](https://github.com/nfl/react-wildcat/commit/9925ed7))
* **react-wildcat:** Use request.path to handle file requests with query strings([e8a7a85](https://github.com/nfl/react-wildcat/commit/e8a7a85))
* **react-wildcat-handoff:** Prefetch the static assets server and known includes.([e63847f](https://github.com/nfl/react-wildcat/commit/e63847f))
* **wildcat-babel:** Re-add references that are lost due to worker process([a5ace39](https://github.com/nfl/react-wildcat/commit/a5ace39))


### Features

* Upgrade to Babel 6([d91ff76](https://github.com/nfl/react-wildcat/commit/d91ff76))
* **example:** Enable hot-reloading in dev mode and production optimizations([a82f235](https://github.com/nfl/react-wildcat/commit/a82f235))
* **react-wildcat:** Add option to minify transpiler output([871f97c](https://github.com/nfl/react-wildcat/commit/871f97c))
* **react-wildcat:** Upgrade to jspm 0.16.34([c91dcf4](https://github.com/nfl/react-wildcat/commit/c91dcf4))


### Performance Improvements

* **react-wildcat-handoff:** Performance updates in default HTML template([6c2ab79](https://github.com/nfl/react-wildcat/commit/6c2ab79))
* **react-wildcat-handoff:** Upgrade initial System bootstrap performance([4fa54a3](https://github.com/nfl/react-wildcat/commit/4fa54a3))
* HTML template performance updates([dd017c7](https://github.com/nfl/react-wildcat/commit/dd017c7))



<a name="3.2.1"></a>
## [3.2.1](https://github.com/nfl/react-wildcat/compare/3.2.0...v3.2.1) (2016-05-06)

### Bug Fixes

* **react-wildcat:** Publish react-wildcat template change


<a name="3.2.0"></a>
# [3.2.0](https://github.com/nfl/react-wildcat/compare/3.1.2...v3.2.0) (2016-04-29)


### Features

* **react-wildcat-handoff:** Add configurable server render type([a2416f4](https://github.com/nfl/react-wildcat/commit/a2416f4))



<a name="3.1.2"></a>
## [3.1.2](https://github.com/nfl/react-wildcat/compare/3.1.1...v3.1.2) (2016-04-19)


### Bug Fixes

* **react-wildcat:** Limit to one worker per server in dev mode ([7ff9682](https://github.com/nfl/react-wildcat/commit/7ff9682))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/nfl/react-wildcat/compare/3.0.0...v3.1.1) (2016-04-17)


### Bug Fixes

* **react-wildcat-handoff:** Pass request, cookies, and renderProps to html templates ([e08567f](https://github.com/nfl/react-wildcat/commit/e08567f))
* **react-wildcat-prefetch:** Fix jspm entry point ([0c7f19a](https://github.com/nfl/react-wildcat/commit/0c7f19a))

### Features

* **react-wildcat-prefetch:** Define static prefetch method as string value ([c6009cb](https://github.com/nfl/react-wildcat/commit/c6009cb))
* **react-wildcat-prefetch:** Make decorator arguments optional ([5549648](https://github.com/nfl/react-wildcat/commit/5549648))
* **react-wildcat-prefetch:** Make fetchData the default static prefetch method name ([1d2fd3b](https://github.com/nfl/react-wildcat/commit/1d2fd3b))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/nfl/react-wildcat/compare/2.4.4...v3.0.0) (2016-04-16)


### Features

* **example:** Add koa-favicon to example project ([b7fe3d5](https://github.com/nfl/react-wildcat/commit/b7fe3d5))
* **react-wildcat:** Upgrade React ([85d665b](https://github.com/nfl/react-wildcat/commit/85d665b))



<a name="2.4.4"></a>
## [2.4.4](https://github.com/nfl/react-wildcat/compare/2.4.3...v2.4.4) (2016-04-09)


### Bug Fixes

* **react-wildcat:** Disable indexedDB cache in test mode ([d7a94e7](https://github.com/nfl/react-wildcat/commit/d7a94e7))
* **react-wildcat:** Use relative path in CREATE log ([cf013a9](https://github.com/nfl/react-wildcat/commit/cf013a9)), closes [#115](https://github.com/nfl/react-wildcat/issues/115)
* **react-wildcat-prefetch:** Wrap composed component display name to avoid losing its canonical name ([69a30e9](https://github.com/nfl/react-wildcat/commit/69a30e9))
* **wildcat-babel:** Reimport the logger utility in worker helper ([9ff1c98](https://github.com/nfl/react-wildcat/commit/9ff1c98))
* **wildcat-babel:** Reimport the logger utility in worker helper ([f1d8bf4](https://github.com/nfl/react-wildcat/commit/f1d8bf4))



<a name="2.4.3"></a>
## [2.4.3](https://github.com/nfl/react-wildcat/compare/2.4.2...v2.4.3) (2016-03-30)


### Bug Fixes

* **react-wildcat:** More absolute paths to modules ([401095f](https://github.com/nfl/react-wildcat/commit/401095f))



<a name="2.4.2"></a>
## [2.4.2](https://github.com/nfl/react-wildcat/compare/2.4.1...v2.4.2) (2016-03-30)


### Bug Fixes

* **react-wildcat:** Absolute paths to package.json ([7a4e7d5](https://github.com/nfl/react-wildcat/commit/7a4e7d5))



<a name="2.4.1"></a>
## [2.4.1](https://github.com/nfl/react-wildcat/compare/2.4.0...v2.4.1) (2016-03-29)


### Bug Fixes

* **react-wildcat:** Fallback to console if logger is not defined ([e9fbf93](https://github.com/nfl/react-wildcat/commit/e9fbf93))
* **react-wildcat:** Fix sourceFileName path ([1a11bc0](https://github.com/nfl/react-wildcat/commit/1a11bc0))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/nfl/react-wildcat/compare/2.3.0...v2.4.0) (2016-03-26)


### Bug Fixes

* **react-wildcat:** Add more lifecycle hooks ([d33a19e](https://github.com/nfl/react-wildcat/commit/d33a19e))
* **react-wildcat:** Add more verbose error logging ([08f27c9](https://github.com/nfl/react-wildcat/commit/08f27c9))
* **react-wildcat:** Fix exported paths to binary files. ([b4dcd99](https://github.com/nfl/react-wildcat/commit/b4dcd99))
* **react-wildcat:** Limit proxy log to one worker ([ac31a77](https://github.com/nfl/react-wildcat/commit/ac31a77))

### Features

* **handoff:** Upgrade React Helmet ([5282310](https://github.com/nfl/react-wildcat/commit/5282310))
* **react-wildcat:** Update template to include new Helmet data ([675a68e](https://github.com/nfl/react-wildcat/commit/675a68e))
* **react-wildcat-handoff:** Update template for new Helmet API ([1b55ff0](https://github.com/nfl/react-wildcat/commit/1b55ff0))



<a name="2.3.5"></a>
## [2.3.5](https://github.com/nfl/react-wildcat/compare/2.3.4...v2.3.5) (2016-03-25)




<a name="2.3.4"></a>
## [2.3.4](https://github.com/nfl/react-wildcat/compare/2.3.3...v2.3.4) (2016-03-25)




<a name="2.3.3"></a>
## [2.3.3](https://github.com/nfl/react-wildcat/compare/2.3.2...v2.3.3) (2016-03-25)


### Bug Fixes

* **react-wildcat:** Add more verbose error logging ([829e053](https://github.com/nfl/react-wildcat/commit/829e053))
* **react-wildcat:** Limit proxy log to one worker ([e63d159](https://github.com/nfl/react-wildcat/commit/e63d159))



<a name="2.3.2"></a>
## [2.3.2](https://github.com/nfl/react-wildcat/compare/2.3.1...v2.3.2) (2016-03-25)


### Bug Fixes

* **react-wildcat:** Add more lifecycle hooks ([0214df8](https://github.com/nfl/react-wildcat/commit/0214df8))



<a name="2.3.1"></a>
## [2.3.1](https://github.com/nfl/react-wildcat/compare/2.3.0...v2.3.1) (2016-03-24)


### Bug Fixes

* **react-wildcat:** Fix exported paths to binary files. ([b4dcd99](https://github.com/nfl/react-wildcat/commit/b4dcd99))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/nfl/react-wildcat/compare/2.2.0...v2.3.0) (2016-03-24)


### Bug Fixes

* **wildcat-babel:** Add option to wait for file write event ([185fe7d](https://github.com/nfl/react-wildcat/commit/185fe7d))

### Features

* **react-wildcat:** Add lifecycle hooks ([59c90d2](https://github.com/nfl/react-wildcat/commit/59c90d2))
* **wildcat-babel:** Add instrumentation support ([596af69](https://github.com/nfl/react-wildcat/commit/596af69))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/nfl/react-wildcat/compare/2.1.1...v2.2.0) (2016-03-22)


### Features

* **react-wildcat:** Add config value to control clustering on app server ([2a183dd](https://github.com/nfl/react-wildcat/commit/2a183dd))
* **react-wildcat:** Add config value to control clustering on static server ([58f5297](https://github.com/nfl/react-wildcat/commit/58f5297))

### Performance Improvements

* **react-wildcat:** Cache the initial server jspm bootstrap ([19809d2](https://github.com/nfl/react-wildcat/commit/19809d2))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/nfl/react-wildcat/compare/2.1.0...v2.1.1) (2016-03-22)


### Bug Fixes

* **react-wildcat:** Fetch all files remotely if localPackageCache is disabled ([a18ff3e](https://github.com/nfl/react-wildcat/commit/a18ff3e))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/nfl/react-wildcat/compare/2.0.2...v2.1.0) (2016-03-21)


### Bug Fixes

* **react-wildcat:** Avoid overriding user config ([3c2d502](https://github.com/nfl/react-wildcat/commit/3c2d502))

### Performance Improvements

* **react-wildcat:** Avoid multiple writes to disk when transpiling on the server ([7c723a6](https://github.com/nfl/react-wildcat/commit/7c723a6))
* **react-wildcat:** Load jspm packages from the local file system in development mode ([1135a6b](https://github.com/nfl/react-wildcat/commit/1135a6b))
* **react-wildcat:** Send transpiled code as response before writing to disk ([1938fa9](https://github.com/nfl/react-wildcat/commit/1938fa9))
* **react-wildcat:** Update middleware order ([cd5631d](https://github.com/nfl/react-wildcat/commit/cd5631d))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/nfl/react-wildcat/compare/2.0.1...v2.0.2) (2016-03-18)


### Bug Fixes

* **react-wildcat-handoff:** Add data-react-available hook on callback ([6756600](https://github.com/nfl/react-wildcat/commit/6756600))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/nfl/react-wildcat/compare/2.0.0...v2.0.1) (2016-03-18)


### Bug Fixes

* **react-wildcat-handoff:** Expire client-side cache on server restart ([e737106](https://github.com/nfl/react-wildcat/commit/e737106))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/nfl/react-wildcat/compare/1.2.0...v2.0.0) (2016-03-17)


### Bug Fixes

* **example:** Enable react-metrics ([7c3a0a7](https://github.com/nfl/react-wildcat/commit/7c3a0a7))
* **example:** Remove time command from scripts ([8f213d5](https://github.com/nfl/react-wildcat/commit/8f213d5))
* **react-wildcat:** Display stack traces if available ([676f8ab](https://github.com/nfl/react-wildcat/commit/676f8ab)), closes [#83](https://github.com/nfl/react-wildcat/issues/83)
* **react-wildcat:** Display stack traces on both server and client ([e6ac40f](https://github.com/nfl/react-wildcat/commit/e6ac40f))
* **react-wildcat:** Update ESLint config ([10662e8](https://github.com/nfl/react-wildcat/commit/10662e8))
* **react-wildcat-handoff:** Cache all modules ([fd2e321](https://github.com/nfl/react-wildcat/commit/fd2e321))
* **react-wildcat-handoff:** Enable/disable IndexedDB cache through wildcat.config.js ([71eaa6b](https://github.com/nfl/react-wildcat/commit/71eaa6b))
* **react-wildcat-handoff:** Make sure cached property exists ([adee37f](https://github.com/nfl/react-wildcat/commit/adee37f))
* **react-wildcat-handoff:** Spelling error ([d03db70](https://github.com/nfl/react-wildcat/commit/d03db70))

### Features

* **example:** Upgrade Radium ([0215481](https://github.com/nfl/react-wildcat/commit/0215481))
* **react-wildcat-handoff:** Remove baked-in Radium settings ([432a81d](https://github.com/nfl/react-wildcat/commit/432a81d))

### Performance Improvements

* **react-wildcat-handoff:** Add client-side jspm package cache ([01d94ee](https://github.com/nfl/react-wildcat/commit/01d94ee))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/nfl/react-wildcat/compare/1.1.1...v1.2.0) (2016-03-15)


### Bug Fixes

* **example:** Add redirect example ([e7a406c](https://github.com/nfl/react-wildcat/commit/e7a406c))
* **react-wildcat:** Catch/throw unhandled Promise rejections ([5fd2843](https://github.com/nfl/react-wildcat/commit/5fd2843)), closes [#70](https://github.com/nfl/react-wildcat/issues/70)

### Features

* **react-wildcat:** Enable config for server-only middleware. ([ea8da44](https://github.com/nfl/react-wildcat/commit/ea8da44))



<a name="1.1.1"></a>
## [1.1.1](//compare/1.1.0...v1.1.1) (2016-03-11)


### Performance Improvements

* **react-wildcat:** Add --cpus flag to specify amount of CPUs to use 753e759
* **react-wildcat:** Transpile code over multiple workers 514c1ce



<a name="1.1.0"></a>
# [1.1.0](//compare/1.0.2...v1.1.0) (2016-03-09)

### Features

* **react-wildcat-handoff:** Upgrade to React Router 2.0.0


### Bug Fixes

* **example** Freeze eslint cbb4c1b
* **react-wildcat** ESLint fixes



<a name="1.0.2"></a>
## [1.0.2](//compare/1.0.1...v1.0.2) (2016-02-25)


### Bug Fixes

* **react-wildcat-hot-reloader:** Use logger to expose more information be39e36



<a name="1.0.1"></a>
## [1.0.1](//compare/1.0.0...v1.0.1) (2016-02-03)


### Bug Fixes

* Updated babel-eslint to 4.1.7 1a1363a



<a name="1.0.0"></a>
# [1.0.0](//compare/1.0.0-rc8...v1.0.0) (2016-01-28)


### Bug Fixes

* **react-wildcat:** pipe more data to Graylog (if available) 5c3fd20
* **react-wildcat-test-runners:** exit with proper error code on error 6506b5e

### Features

* **react-wildcat-handoff:** support for ephemeral subdomains eb2c943

### Performance Improvements

* **react-wildcat:** improve initial server response b506899



<a name="1.0.0-rc8"></a>
# [1.0.0-rc8](//compare/1.0.0-rc7...v1.0.0-rc8) (2016-01-20)


### Features

* **react-wildcat:** specify files to compile using a manifest b6c4b18



<a name="1.0.0-rc7"></a>
# [1.0.0-rc7](//compare/1.0.0-rc6...v1.0.0-rc7) (2016-01-19)


### Bug Fixes

* **react-wildcat:** disable gzip in test mode f1d45ce
* **react-wildcat-hot-reloader:** convert template strings to es5 strings a079224



<a name="1.0.0-rc6"></a>
# [1.0.0-rc6](//compare/1.0.0-rc5...v1.0.0-rc6) (2016-01-16)


### Bug Fixes

* **react-wildcat-prefetch:** array handling 98f6165
* **react-wildcat-prefetch:** reuse prefetch key when rehydrating data 41b527e
* **react-wildcat-test-runners:** only add wrapping braces for multiple files 1511e20

### Features

* **react-wildcat-test-runners:** allow coverage to be scoped to specified files b7595a3, closes #42
* **react-wildcat-test-runners:** allow coverage to be scoped to specified files 4a1450e, closes #42



<a name="1.0.0-rc5"></a>
# [1.0.0-rc5](//compare/1.0.0-rc4...v1.0.0-rc5) (2016-01-15)


### Bug Fixes

* **react-wildcat-hot-reloader:** return the full failedModuleDependencies array 60e4881
* **react-wildcat-hot-reloader:** update SystemJS module trace on file change 08494ac



<a name="1.0.0-rc4"></a>
# [1.0.0-rc4](//compare/1.0.0-rc3...v1.0.0-rc4) (2016-01-14)


### Bug Fixes

* **react-wildcat-prefetch:** fix prefetch hydration 0a9f52e

### Performance Improvements

* **react-wildcat:** disable gzip writes in dev mode 1df960c



<a name="1.0.0-rc3"></a>
# [1.0.0-rc3](//compare/1.0.0-rc2...v1.0.0-rc3) (2016-01-12)


### Bug Fixes

* **react-wildcat-test-runners:** absolute path to webdriver 2508b90
* **react-wildcat-test-runners:** transpile module before publishing 520bbad



<a name="1.0.0-rc2"></a>
# [1.0.0-rc2](//compare/1.0.0-rc1...v1.0.0-rc2) (2016-01-11)


### Bug Fixes

* **example:** access wildcat-babel directly 87dc33f

### Features

* **react-wildcat:** code coverage analysis for e2e tests 34d9ac6
* **react-wildcat:** code coverage analysis for unit tests 62938b4
* **react-wildcat-test-runners:** initial release 73ce0f8



<a name="1.0.0-rc1"></a>
# [1.0.0-rc1](//compare/1.0.0-beta10...v1.0.0-rc1) (2016-01-04)


### Bug Fixes

* **react-wildcat:** enable System.trace in dev mode 156224d
* **react-wildcat:** Invalidate failed module imports f456a92
* **react-wildcat:** use System.normalize to resolve module names 79cd0c2
* **react-wildcat-handoff:** reject Promise if error is found e232122
* **react-wildcat-handoff:** use object longhand notation for browsers c1b58e8



<a name="1.0.0-beta10"></a>
# [1.0.0-beta10](//compare/1.0.0-beta9...v1.0.0-beta10) (2015-12-21)


### Bug Fixes

* **react-wildcat:** fix api regression a141ec5

### Performance Improvements

* **react-wildcat:** avoid resetting jspm package path bd35169
* **react-wildcat:** cache System.normalize reference 845dfad
* **react-wildcat:** remove route cache 49ce8eb



<a name="1.0.0-beta8"></a>
# [1.0.0-beta8](//compare/1.0.0-beta7...v1.0.0-beta8) (2015-12-18)


### Bug Fixes

* **example:** disable react-metrics due to incompatibility 8d442d7
* **react-wildcat:** log process id 460d610
* **react-wildcat:** print performance metrics in debug mode 4d17084
* **react-wildcat-handoff:** Add workaround for navigator.userAgent requirement 4ccaa57
* **react-wildcat-handoff:** catch and reject rendering errors 52f5f51

### Performance Improvements

* **react-wildcat:** convert custom jspm loader to a singleton pattern d3ad011
* **react-wildcat:** remove per-route cache invalidation 4ee42af
* **react-wildcat:** store cache data in a weak map 2bacbcb



<a name="1.0.0-beta7"></a>
# [1.0.0-beta7](//compare/1.0.0-beta5...v1.0.0-beta7) (2015-12-05)


### Bug Fixes

* **react-wildcat:** add css / swf to normalize whitelist 604abd9
* **react-wildcat:** avoid caching unsuccessful responses 4ceba69
* **react-wildcat:** disable http connection limit 3775aa5
* **react-wildcat:** share config between servers 7e9031e
* **react-wildcat:** update bbod 10cf725
* **react-wildcat-handoff:** add css / swf to normalize whitelist 226d62c
* **react-wildcat-handoff:** escape regex character dac7603
* **react-wildcat-handoff:** make es5-friendly a758174
* **react-wildcat-handoff:** mirror client render and context 84c46cf
* **react-wildcat-handoff:** reject promise on error 84f8948
* **react-wildcat-handoff:** send 200 status 959cc53
* **react-wildcat-prefetch:** add css / swf to normalize whitelist 71de5f2

### Features

* **react-wildcat:** add more custom log levels e9b8e66

### Performance Improvements

* **react-wildcat:** disable cache check in dev mode 95fb287



<a name="1.0.0-beta5"></a>
# [1.0.0-beta5](//compare/1.0.0-beta4...v1.0.0-beta5) (2015-11-23)


### Bug Fixes

* **example:** allow port values to be falsy in production environments b84d7b9
* **react-wildcat:** add code coverage ba7d2ce
* **react-wildcat:** allow entry config to be falsy e59e0f8
* **react-wildcat-handoff:** request initial imports in parallel 073787e
* **react-wildcat-prefetch:** add code coverage 1e53d64

### Features

* **react-wildcat-handoff:** add a simple render option e0b060c


## 1.0.0-beta4

- **Bug Fixes**
    - Bump dependencies
    - **example**
        - Lint fixes
    - **react-wildcat**
        - Update cluster workers to aid with concurrency
    - **react-wildcat-ensure**
        - Use SystemJS to manage cached modules
        - DRY up code
        - Add more unit test coverage
    - **react-wildcat-handoff**
        - Pass user-agent to server to render universal server/client styles
    - **react-wildcat-radium**
        - Pass user-agent to Radium to render universal server/client styles

## 1.0.0-beta3

- **Bug Fixes**
    - Update ESLint settings to resolve jspm packages
    - Update .gitignore / .npmignore
    - Bump dependencies
    - **example**
        - Numerous bug fixes raised by unit tests
    - **react-wildcat**
        - Numerous bug fixes raised by unit tests
    - **react-transform-module-hot-stub**
        - Numerous bug fixes raised by unit tests
    - **react-wildcat-handoff**
        - Numerous bug fixes raised by unit tests
    - **react-wildcat-prefetch**
        - Numerous bug fixes raised by unit tests
    - **react-wildcat-radium**
        - Numerous bug fixes raised by unit tests
- **Features**
    - Initial unit tests and code coverage
    - **react-wildcat**
        - Reorganize Wildcat configuration API
        - Allow devs to provide their own security certificates
        - Add support for plain HTTP
    - **react-wildcat-ensure**
        - Initial release
    - **react-wildcat-handoff**
        - Match leaf domains (i.e. `www.foo.bar.example.com`)

## 1.0.0-beta2

- **Bug Fixes**
    - Bypass prompt in install shell script
    - Upgrade to React Router 1.0.0-rc4
    - Upgrade to React 0.14.2
    - **react-wildcat-prefetch**
        - Don't assume the initial payload is an object
- **Features**
    - **react-wildcat-handoff**
        - Add support for more than one subdomain

## 1.0.0-beta1
- **Features**
    - Initial release
