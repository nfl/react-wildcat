import "babel-polyfill";
import "isomorphic-fetch";

import server from "react-wildcat-handoff/server";

import routes from "./routes.config.js";

export default server({
    routes
});
