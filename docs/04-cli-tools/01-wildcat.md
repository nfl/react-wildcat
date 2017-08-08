# `wildcat`
Starts the node application server that handles incoming requests and server side rendering.

## wildcat.config.js

Configuration information for a wildcat project lives in a `wildcat.config.js` in the project's root directory. Everything is configurable, but by default wildcat loads [sensible defaults](https://github.com/nfl/react-wildcat/blob/master/packages/react-wildcat-handoff/src/utils/defaultTemplate.js). For a brand new project, we recommend copying the [example project](https://github.com/nfl/react-wildcat/tree/master/example) and tweaking from there.
## Environment Variables
Certain features of wildcat can be enabled and disabled via environment variables.

### COVERAGE
Enable code coverage generation with Istanbul. Defaults to false.
### DEBUG
Setting `DEBUG=wildcat` logs a memory profile to a file and allows you to troubleshoot memory issues with your app via the
chrome development tools.
### HOST
Set the hostname for the app server. Defaults to localhost.
### LOG_LEVEL
Log level value from 0 (no logs) to 4 (debug level). Defaults to 4.
### MINIFY
Use webpack to minify JavaScript assets. Defaults to true if `NODE_ENV=production`
### NODE_ENV
Setting to "production" minifies and builds the project while "development" enables hot reloading. Defaults to "development".
### PORT
Port to run wildcat app server. Defaults to 3000
### SERVICE_WORKERS
Generate a [Service Worker](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker). By default a service worker
is generated if `NODE_ENV=production`. Set `SERVICE_WORKERS` to override the default behavior.
### STATIC_HOST
Set the hostname for the static server. Defaults to localhost.
### STATIC_PORT
Port to run wildcat static server. Defaults to 4000.
