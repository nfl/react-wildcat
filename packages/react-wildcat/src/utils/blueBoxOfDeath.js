module.exports = function blueBoxOfDeath(err, request) {
    const path = require("path");
    const wildcatPkg = require(path.resolve(__dirname, "../../package.json"));

    const name = wildcatPkg.name;
    const version = wildcatPkg.version;
    const dependencies = wildcatPkg.dependencies;
    const author = wildcatPkg.author;
    const license = wildcatPkg.license;

    const bbod = `
<!doctype html>
<html>
    <head>
        <title>‼️💩️️ Runtime Error️</title>
        <meta name="viewport" content="width=device-width; initial-scale=1.0;">
        <style>
            .bbod, .bbod * {
                margin: 0;
                padding: 0;
                line-height: 1.5em;
                box-sizing: border-box;
                border-radius: 3px;
            }

            .bbod {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                font-size: 1em;
                padding: 2em 3em;
                width: 100%;
                background: rgb(0, 102, 204);
                color: white;
            }

            .bbod .message {
                font-weight: bold;
            }

            .bbod .info {
                padding: 1.25em 1.5em;
                margin-top: 1em;
                border: 1px dashed rgba(0, 0, 0, 0.5);
                background: rgba(255, 255, 255, 0.1);
            }

            .bbod ul {
                margin: 1em 3em 0.25em;
                font-weight: normal;
            }

            .bbod code {
                display: inline-block;
                background: rgba(0, 0, 0, 0.5);
                padding: 0.05em 0.4em;
                cursor: default;
            }

            .bbod .stack {
                margin-top: 1.5em;
                padding-top: 1em;
                border-top: 1px solid rgba(0, 0, 0, 0.5);
            }

            .bbod .stack h3 {
                margin: 0.25em 0 0.5em;
            }

            .bbod .stack pre {
                margin: 0.5em 0 0;
                padding: 1.25em 1.5em;
                white-space: pre-wrap;
                background: rgba(0, 0, 0, 0.5);
                color: rgba(255, 255, 255, 0.9);
                overflow: auto;
                font: 0.95em 1em/1.5em "Operator Mono", monospace;
                transition: all 0.15s linear;
            }

            .bbod .stack:hover pre {
                background: rgba(0, 0, 0, 0.8);
                color: rgba(255, 255, 255, 1);
            }
        </style>
    </head>
    <body class="bbod">
        <h1>Runtime Error</h1>

        <div class="message">
            <h3>An error occurred rendering route <code>${request.url}</code>.</h3>
        </div>

        <div class="message info">
            <p>This may be the result of attempting to load missing or invalid jspm package(s). Possible solutions:</p>
            <ul>
                <li>Check your console for <code>40x</code> or <code>50x</code> status codes. These should identify missing packages or modules.</li>
                <li>Run <code>jspm install</code> to install any missing dependencies.</li>
            </ul>
        </div>

        ${err ? `
            <div class="stack">
                <h4>Error Message:</h4>
                <pre>${err}</pre>
            </div>

            <div class="stack">
                <h4>Stack Trace:</h4>
                <pre>${err.stack}</pre>
            </div>
        ` : ""}

        <div class="stack">
            <h4>Server Request Payload:</h4>
            <pre>${JSON.stringify(request, null, 4)}</pre>
        </div>

        <div class="stack">
            <h4>Wildcat Metadata:</h4>
            <pre>${JSON.stringify({
                name,
                version,
                dependencies,
                author,
                license
            }, null, 4)}</pre>
        </div>
    </body>
</html>
    `.trim();

    return bbod;
};
