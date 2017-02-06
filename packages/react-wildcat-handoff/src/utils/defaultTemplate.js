const __PROD__ = process.env.NODE_ENV === "production";

module.exports = function defaultTemplate({
    data,
    head,
    html,
    wildcatConfig: {
        clientSettings: {
            reactRootElementID,
            serviceWorker
        },
        generalSettings: {
            staticUrl
        }
    }
}) {
    const helmetTags = Object.keys(head)
        .filter(meta => meta !== "htmlAttributes")
        .map(meta => head[meta].toString().trim());

    return `
<!doctype html>
<html ${head.htmlAttributes.toString()}>
    <head>
        <link rel="dns-prefetch" href="${staticUrl}" />
        <link rel="preconnect" href="${staticUrl}" />

        ${helmetTags.join(``)}
    </head>
    <body>
        <div id="${reactRootElementID}">${html}</div>

        ${serviceWorker ? `
        <script>
            // Register service worker
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("/serviceWorker.js").catch(function (e) {
                    console.error("Error during service worker registration:", e);
                });
            }
        </script>
        ` : ``}
        <script>
            __INITIAL_DATA__ = ${JSON.stringify(data)};
            __REACT_ROOT_ID__ = "${reactRootElementID}";
        </script>

        ${__PROD__ ? `
        <script defer src="${staticUrl}/bundles/manifest.bundle.js"></script>
        <script defer src="${staticUrl}/bundles/bootstrap.bundle.js"></script>
        ` : `
        <script defer src="${staticUrl}/bundles/dependencies.bundle.js"></script>
        `}
        <script defer src="${staticUrl}/bundles/app.bundle.js"></script>
    </body>
</html>
`.trim();
};
