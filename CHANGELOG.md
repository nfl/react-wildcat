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
