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
