module.exports = function blueBoxOfDeath(err, request) {
    const bbod = `
<!doctype html>
<html>
    <head>
        <title>jspm import error</title>
        <style>
            .bbod {
                box-sizing: border-box;
                font-family: sans-serif;
                font-size: 1em;
                position: fixed;
                padding: 10px;
                top: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                background: rgb(0, 102, 204);
                color: white;
            }

            .bbod .message {
                font-weight: bold;
            }

            .bbod ul {
                font-weight: normal;
            }

            .bbod li {
                margin-bottom: 2px;
            }

            .bbod code {
                display: inline-block;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 2px;
                padding: 2px 4px;
                cursor: default;
                transition: all 0.15s linear;
            }

            .bbod li:hover code {
                background: rgba(0, 0, 0, 0.9);
            }

            .bbod .stack {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(0, 0, 0, 0.5);
                font-family: monospace;
                overflow: auto;
            }

            .bbod .stack h3 {
                margin: 5px 0 10px;
            }

            .bbod .stack pre {
                margin: 0;
                padding: 10px;
                white-space: pre-wrap;
                background: rgba(0, 0, 0, 0.5);
                color: rgba(255, 255, 255, 0.8);
                border-radius: 2px;
            }
        </style>
    </head>
    <body>
        <div class="bbod">
            <div class="message">
                <p>An error occurred importing jspm packages for route <code>${request.url}</code>.</p>
                <p>This is usually the result of attempting to load missing or invalid jspm package(s). Possible solutions:</p>
                <ul>
                    <li>Check your console for <code>40x</code> or <code>50x</code> status codes. These should identify missing packages or modules.</li>
                    <li>Run <code>jspm install</code> to install any missing dependencies.</li>
                </ul>
            </div>
            ${err ? `
                <div class="stack">
                    <h3>jspm error message:</h3>
                    <pre>${err}</pre>
                </div>
            ` : ""}
            <div class="stack">
                <h3>server request payload:</h3>
                <pre>${JSON.stringify(request, null, 4)}</pre>
            </div>
        </div>
    </body>
</html>
    `.trim();

    return bbod;
};
