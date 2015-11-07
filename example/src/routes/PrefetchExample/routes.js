import ensure from "react-wildcat-ensure";

// React router route
export const path = "/prefetch-example";

// Lazy loaded components
export function getComponent(location, cb) {
    ensure(["./PrefetchExample"], module, function (err, [module]) {
        return cb(err, module);
    });
}
