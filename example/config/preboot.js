const fs = require("fs");
const preboot = require("preboot");

try {
    const inlineCode = preboot.getInlineCode({
        appRoot: "#content",    // selector for root element
        buffer: false,
        debug: true,
        uglify: false
    });

    fs.writeFile("static/preboot.js", inlineCode);
} catch (err) {
    console.error(err);
}
