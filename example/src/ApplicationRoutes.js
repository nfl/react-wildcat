import React from "react";
import {IndexRoute, Redirect, Route} from "react-router";

import ApplicationContext from "./components/Application/ApplicationContext.js";

import * as indexExampleRoutes from "./routes/IndexExample/routes.js";
import * as errorExampleRoutes from "./routes/ErrorExample/routes.js";
import * as flexboxExampleRoutes from "./routes/FlexboxExample/routes.js";
import * as helmetExampleRoutes from "./routes/HelmetExample/routes.js";
import * as prefetchExampleRoutes from "./routes/PrefetchExample/routes.js";
import * as prebootExampleRoutes from "./routes/PrebootExample/routes.js";

const Routes = (
    <Route path="/" component={ApplicationContext}>
        <IndexRoute {...indexExampleRoutes} />

        <Route {...errorExampleRoutes} />
        <Route {...flexboxExampleRoutes} />
        <Route {...helmetExampleRoutes} />
        <Route {...prefetchExampleRoutes} />
        <Route {...prebootExampleRoutes} />

        <Redirect from="/redirect" to="/flexbox-example" />
    </Route>
);

export default Routes;
