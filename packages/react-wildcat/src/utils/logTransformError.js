module.exports = function logTransformError(err) {
    return `${err.name}: ${err.message}\n${err.codeFrame}`;
};
