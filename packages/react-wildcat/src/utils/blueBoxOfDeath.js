module.exports = function blueBoxOfDeath(err, request) {
    const errors = Array.isArray(err) ? err : [err];
    const bbod = `
<!doctype html>
<html>
    <head>
        <title>‼️💩️️ Runtime Error️</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
                background: rgb(50, 50, 50);
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
                background: rgba(0, 0, 0, 0.75);
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
                background: rgba(0, 0, 0, 0.75);
                color: rgba(255, 255, 255, 0.9);
                overflow: auto;
                font: 0.95em 1em/1.5em "Operator Mono", monospace;
                transition: all 0.15s linear;
            }

            .bbod .stack:hover pre {
                background: rgba(0, 0, 0, 0.95);
                color: rgba(255, 255, 255, 1);
            }
        </style>
    </head>
    <body class="bbod">
        <h1>Runtime Error</h1>

        <div class="message">
            <h3>An error occurred rendering route <code>${
                request.url
            }</code>.</h3>
        </div>

        <div class="message info">
            <p>Possible solutions:</p>
            <ul>
                <li>Check your console for <code>40x</code> or <code>50x</code> status codes. These should identify missing modules.</li>
                <li>Run <code>yarn</code> or <code>npm install</code> to install any missing dependencies.</li>
            </ul>
        </div>

        ${errors.filter(error => error).map(
            error => `
                <div class="stack">
                    <h4>${error.id || "Error Message"}:</h4>
                    <pre>${error.message}</pre>
                </div>

                ${
                    error.stack
                        ? `
                    <div class="stack">
                        <h4>Stack Trace:</h4>
                        <pre>${error.stack}</pre>
                    </div>
                `
                        : ``
                }
            `
        )}

        <div class="stack">
            <h4>Server Request Payload:</h4>
            <pre>${JSON.stringify(request, null, 4)}</pre>
        </div>
    </body>
</html>
    `.trim();

    return bbod;
};
