const fs = require("fs");
const preboot = require("nfl-preboot");

try {
    const inlineCode = preboot.getInlineCode({
        serverClientRoot: [{
            serverSelector: "#content",
            clientSelector: "#content"
        }],
        buffer: false,
        debug: false,
        uglify: true,
        eventSelectors: [
            // for recording changes in form elements
            {selector: "input,textarea", events: ["keypress", "keyup", "keydown", "input", "change"]},
            {selector: "select,option", events: ["change"]},

            // when user hits return button in an input box
            {selector: "input", events: ["keyup"], preventDefault: true, keyCodes: [13], freeze: true},

            // for tracking focus (no need to replay)
            {selector: "input,textarea", events: ["focusin", "focusout", "mousedown", "mouseup"], noReplay: true},

            // user clicks on a button
            {selector: "input[type=\"submit\"],button", events: ["click"], preventDefault: true, freeze: true}
        ]});

    fs.writeFile("static/preboot.js", inlineCode);
} catch (err) {
    console.error(err);
}
