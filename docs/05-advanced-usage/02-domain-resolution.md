## Domain resolution

There are two ways to define routes in Wildcat. Using regular expressions, or the legacy method of using objects.
It's recommended to use regular expressions as they're a lot more powerful, and support multi-level domains
(e.g. foo.bar.baz.bar.com will not resolve using the legacy syntax). You can either pass in a React Router route
or a function that returns a component.

```javascript
{
    domains: {
        routes: {
            "foo.bar.baz.*(dev|com)": function getRoutes(location, cb) {
                return setTimeout(() => cb(null, routes), 0);
            },
            "www.example.(dev|com)": routes /* React Router Route */
        }
    }
}
```

Old syntax:
```javascript

{
    domains: {
        domainAliases: {
            example: {
                www: ["localhost", "example", "www.example", "127.0.0.1"],
                dev: "127.0.0.2"
            }
        },
        www: routes /* React Router route */
    }
}
```
