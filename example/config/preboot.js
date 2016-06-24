const fs = require("fs");
const preboot = require("preboot");

try {
    const inlineCode = preboot.getInlineCode({
        serverClientRoot: [{
            serverSelector: "#content",
            clientSelector: "#content"
        }],
        buffer: false,
        debug: true,
        uglify: false,
        eventSelectors: [{
            selector: 'input[type="submit"],button',
            events: ["click"],
            preventDefault: true,
            freeze: true
        }]
    });

    fs.writeFile("static/preboot.js", inlineCode);
} catch (err) {
    console.error(err);
}
