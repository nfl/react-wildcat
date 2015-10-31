var radium = require("radium");
radium = radium.default || radium;

var _matchMedia = null;

var ConfiguredRadium = function ConfiguredRadium(component) {
    return radium({
        matchMedia: _matchMedia
    })(component);
};

ConfiguredRadium.setMatchMedia = function setMatchMedia(matchMedia) {
    _matchMedia = matchMedia;
};

ConfiguredRadium.Plugins = radium.Plugins;
ConfiguredRadium.PrintStyleSheet = radium.PrintStyleSheet;
ConfiguredRadium.Style = radium.Style;
ConfiguredRadium.getState = radium.getState;
ConfiguredRadium.keyframes = radium.keyframes;

module.exports = ConfiguredRadium;
