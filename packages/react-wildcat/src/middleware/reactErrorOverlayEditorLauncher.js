const launchEditor = require("react-dev-utils/launchEditor");

module.exports = function(app) {
    const reactErrorOverlayEditorLauncher = function*(next) {
        yield next;

        if (this.response.status === 500) {
            launchEditor(
                this.state.reactErrorOverlay.file,
                this.state.reactErrorOverlay.line
            );
        }
    };

    app.use(reactErrorOverlayEditorLauncher);
};
