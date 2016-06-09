const fs = require("fs");
const preboot = require("preboot");

preboot.getBrowserCode({
    appRoot: "body",    // selector for root element
    freeze: "spinner",     // show spinner w button click & freeze page
    replay: "rerender",    // rerender replay strategy
    buffer: true,          // client app will not write to hidden div until bootstrap complete
    debug: true,
    uglify: false,
    presets: ["keyPress", "buttonPress", "focus"]
}).then((r) => {
    return fs.writeFile("static/preboot.js", r);
}).catch((err) => {
    console.error(err);
});
