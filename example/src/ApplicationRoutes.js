import React from "react";
import {IndexRoute, Redirect, Route} from "react-router";

import ApplicationContext from "./components/Application/ApplicationContext.js";

import * as indexExampleRoutes from "./routes/IndexExample/routes.js";
import * as errorExampleRoutes from "./routes/ErrorExample/routes.js";
import * as flexboxExampleRoutes from "./routes/FlexboxExample/routes.js";
import * as helmetExampleRoutes from "./routes/HelmetExample/routes.js";
import * as prefetchExampleRoutes from "./routes/PrefetchExample/routes.js";

const testEnter = (nextState, replace, callback) => {
    console.log("OH HAI THAR");
    replace("/prefetch-example");
    callback();
};

const Routes = (
    <Route path="/" component={ApplicationContext}>
        <IndexRoute {...indexExampleRoutes} />

        <Route {...errorExampleRoutes} />
        <Route {...flexboxExampleRoutes} onEnter={testEnter} />
        <Route {...helmetExampleRoutes} />
        <Route {...prefetchExampleRoutes} />

        <Redirect from="/redirect" to="/flexbox-example" />
    </Route>
);

export default Routes;
