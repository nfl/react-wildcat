// "e2e": "npm run webdriver-update && protractor protractor.config.js",
require("babel/register")({
    retainLines: true,
    sourceRoot: __dirname
});

// Use a require so we can do awesome ES7 stuff
require("./karma.js");
