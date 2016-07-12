<img src="http://static.nfl.com/static/content/public/static/img/logos/nfl-engineering-light.svg" width="300" />

# React Wildcat

[![Join the chat at https://gitter.im/nfl/react-wildcat](https://badges.gitter.im/nfl/react-wildcat.svg)](https://gitter.im/nfl/react-wildcat?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![npm package](https://img.shields.io/npm/v/react-wildcat.svg?style=flat-square)](https://www.npmjs.org/package/react-wildcat)
[![build status](https://img.shields.io/travis/nfl/react-wildcat/master.svg?style=flat-square)](https://travis-ci.org/nfl/react-wildcat)
[![codecov.io](https://codecov.io/github/nfl/react-wildcat/coverage.svg?branch=master)](https://codecov.io/github/nfl/react-wildcat?branch=master)
[![dependency status](https://img.shields.io/david/nfl/react-wildcat.svg?style=flat-square)](https://david-dm.org/nfl/react-wildcat)

A new, opinionated React environment from the National Football League. [Read more on Wildcat](https://medium.com/nfl-engineers/nfl-react-84e9cd11d384#.rlwui1p4z).

## Todo

Add more documentation. So much to document...

## Features

- **dev tooling**
    - Bundle-free development environment
    - Short and sweet time-to-dev (see [Getting Started](#getting-started) below)
    - Babel for on-the-fly component transpilation
    - react-transform-hmr for hot component reloading
    - jspm + SystemJS for client-side module resolving
    - Karma + Mocha + Chai + Sinon for unit tests
    - Istanbul for code coverage
    - Protractor + Mocha + Chai for e2e integration tests
    - eslint for static code analysis
- **client**
    - React 0.14 + React Router 1.0 on the cilent and server
    - Route-based lazy component loading with React Router + jspm
    - Radium for inline styling
    - Helmet for managing your document head
    - React Metrics for tracking analytics
    - Store-agnostic Prefetching for client data hydration
- **server**
    - Loads client dependencies from a centralized location (no more per-project bundles)
    - Koa + (optional) HTTP2 for fast file serving
    - TLS-only via secure HTTP
    - Optimized production workflow

## Server Requirements

- Node v4.x (install via ([n](https://github.com/tj/n)): `n 4.x`)
- npm v3.x (`npm install -g npm`)
- jspm v0.16.x (`npm install -g jspm`)

## Client Requirements

- IE10+

## Development environment

### First time jspm users

For first-time jspm users, you will need to configure it to use GitHub:

- `jspm registry config github`

Follow the steps to enable GitHub access.

### Getting started

Clone this repository, then:

- `make install`
- `cd example`
- `docker-compose up` or `npm run dev`
- Open `https://localhost:3000`

## ulimit increase

You'll very likely need to increase the file watch limit. [Follow these steps](http://stackoverflow.com/a/27982223) to do so.

## Accepting the development SSL certificate:

While it is possible to run the environment with an untrusted SSL certificate, for best results you should have OS X trust the self-signed certificate. Here's how:

- Run the development environment
- Navigate to https://localhost:3000
- Follow these steps: [http://www.andrewconnell.com/blog/setup-self-signed-certificates-trusting-them-on-os-x](http://www.andrewconnell.com/blog/setup-self-signed-certificates-trusting-them-on-os-x#add-the-certificate-as-a-trusted-root-authority)
- Repeat the above steps for the static file server at https://localhost:4000

## Production environment

Wildcat is designed to run on two servers:

- A Node server which accepts HTTP requests and renders static markup
- (optional) A static file server that serves static assets (JavaScript files, CSS, images, etc)

This setup provides several benefits, including:

- A single point of origin for serving all web projects.
- A single point of origin for static file assets.
- Ownership of static asset file caching.
- Delta static asset cache purging.
- The ability to update static files without a server reboot.
- An (optional) use of HTTP2, including push support for static assets.

Each server should have the required tools installed (see above). Each server is designed to run in its own environment. Below is an implementation reference to set up and run the web prototype:

### Node server

Your app server environment must contain the following files and directories:

```
package.json
system.config.js
wildcat.config.js
```

```shell
cd path/to/project
npm install --production
jspm install
env PORT=80 STATIC_URL=https://static.example.com npm run prod
```

### Static assets

**Note**: The provided static file server is an optional dependency. The app server is agnostic about what solution is provided to serve static assets. It only expects the correct files to live in the domain specified via your `STATIC_URL` environment variable.

Your static server environment must contain the following files and directories:

```
bin
bundles
favicon.ico
jspm_packages
public
system.config.js
```

Follow step one below to implement your own custom server, or skip to step 2 to use the bundled static asset server.

### 1. Custom static server

You will need to precompile the static assets:

```shell
cd path/to/project
npm install --production
jspm install
env STATIC_URL=https://static.example.com npm run preprod-static
```

### 2. Setting up the static file server

```shell
cd path/to/project
npm install --production
jspm install
env STATIC_URL=https://static.example.com npm run prod-static
```

## Environment variables

`LOGGING_HOST` The graylog host to use to send server logs too.

## License

MIT
