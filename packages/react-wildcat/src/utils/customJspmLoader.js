let customizedLoader;

function customizeJspmLoader(root, {
    wildcatConfig: {
        serverSettings
    }
}) {
    const path = require("path");

    const pkg = require(path.join(root, "package.json"));
    const jspm = require("jspm");
    const remoteURL = require("../polyfills/baseURI");

    const jspmLoader = jspm.Loader();

    if (!serverSettings.localPackageCache) {
        jspmLoader.baseURL = remoteURL;
    }

    // store the old normalization function
    const systemNormalize = jspmLoader.normalize;
    const packagesPath = ((pkg.jspm || {}).directories || {}).packages || "jspm_packages";

    jspm.setPackagePath(root);

    // override the normalization function
    function customNormalize(name, parentName, parentAddress) {
        return systemNormalize.call(this, name, parentName, parentAddress).then(
            function normalizeCallback(url) {
                // ~~~~~~~~~~~ DO NOT DELETE ~~~~~~~~~~~
                // Set up jspm to use our custom fetch implementation
                if (serverSettings.localPackageCache && !url.includes(packagesPath)) {
                    url = url.replace(jspmLoader.baseURL, `${remoteURL}/`);
                }
                // ~~~~~~~~~~~ DO NOT DELETE ~~~~~~~~~~~

                // FIXME: Possibly not needed in jspm 0.17
                if ((/\.(?:css|eot|gif|jpe?g|json|otf|png|swf|svg|ttf|woff)\.js$/).test(url)) {
                    return url.replace(/\.js$/, "");
                }

                return url;
            }
        );
    }

    // Add custom configuration
    jspmLoader.config({
        normalize: customNormalize,
        trace: !!serverSettings.hotReloader
    });

    // Make our custom jspm loader available
    customizedLoader = jspmLoader;
    return customizedLoader;
}

module.exports = function customJspmLoader(root, options) {
    return customizedLoader || customizeJspmLoader(root, options);
};
