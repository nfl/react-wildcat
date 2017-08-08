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
env PORT=80 STATIC_URL=https://static.example.com npm run prod
```

### Static assets

**Note**: The provided static file server is an optional dependency. The app server is agnostic about what solution is provided to serve static assets. It only expects the correct files to live in the domain specified via your `STATIC_URL` environment variable.

Your static server environment must contain the following files and directories:

```
bin
bundles
favicon.ico
public
system.config.js
```

Follow step one below to implement your own custom server, or skip to step 2 to use the bundled static asset server.

### 1. Custom static server

You will need to precompile the static assets:

```shell
cd path/to/project
npm install --production
env STATIC_URL=https://static.example.com npm run preprod-static
```

### 2. Setting up the static file server

```shell
cd path/to/project
npm install --production
env STATIC_URL=https://static.example.com npm run prod-static
```
