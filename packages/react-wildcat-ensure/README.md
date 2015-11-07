<img src="http://static.nfl.com/static/content/public/static/img/logos/nfl-engineering-light.svg" width="300" />

# react-wildcat-ensure

[![npm package](https://img.shields.io/npm/v/react-wildcat-ensure.svg?style=flat-square)](https://www.npmjs.org/package/react-wildcat-ensure)

A wrapper for [`System.import`](https://github.com/systemjs/systemjs) that behaves like Webpack's [`require.ensure`](https://webpack.github.io/docs/code-splitting.html#require-ensure):

- initial import calls are asynchronous
- subsequent import calls returns a synchronous cached import response

Designed for compatibility with React Router's [asynchronous route loading](https://github.com/rackt/react-router/blob/master/docs/guides/advanced/DynamicRouting.md).

## Installation

jspm:

```bash
jspm install react-wildcat-ensure
```

npm:

```bash
npm install react-wildcat-ensure
```

## Example

Importing a single module:

```js
import ensure from "react-wildcat-ensure";

// Lazy loaded component
export function getComponent(location, cb) {
    ensure("./AsyncComponent.js", module, (err, module) => {
        return cb(err, module);
    });
}
```

Importing a key/value hash of modules:

```js
import ensure from "react-wildcat-ensure";

// Lazy loaded index route
export function getIndexRoute(location, cb) {
    ensure({
      header: "./AsyncHeader.js",
      component: "./AsyncComponent.js"
    }, module, (err, modules) => {
        return cb(err, modules);
    });
}
```

Importing an array of modules:

```js
import ensure from "react-wildcat-ensure";

// Lazy loaded child routes
export function getChildRoutes(location, cb) {
    ensure([
      "./AsyncChildRouteOne.js",
      "./AsyncChildRouteTwo.js"
    ], module, (err, modules) => {
        return cb(err, modules);
    });
}
```

# License

MIT
