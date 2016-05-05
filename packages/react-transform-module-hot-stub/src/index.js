/**
 * This is a stub to bypass this conditional check in react-transform-hmr:
 * https://github.com/gaearon/react-transform-hmr/blob/master/src/index.js#L27-L34
 *
 * @param  {Array} options.locals an array of modules to mark as hot
 * @return {Function} A wrapper function that returns a pristine ReactClass
 */
function moduleHotStub(ref) {
    const local = (ref.locals || [])[0];

    if (local) {
        local.hot = local.hot || {};
        local.hot.accept = local.hot.accept || function hotStub() {};
    }

    return function hotStubClass(ReactClass) {
        return ReactClass;
    };
}

module.exports = moduleHotStub;
