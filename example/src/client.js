import "babel-polyfill";
import client from "react-wildcat-handoff/client";

if (module && module.hot) {
    module.hot.accept("./routes.config.js", getRoutes);
}

export function getRoutes() {
    client({
        routes(location, cb) {
            import("./routes.config.js").then(
                routes => cb(null, routes.default),
                cb
            );
        }
    });
}

export default getRoutes();
