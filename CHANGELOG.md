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
