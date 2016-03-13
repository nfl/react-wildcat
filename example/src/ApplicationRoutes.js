import React from "react";
import {IndexRoute, Redirect, Route} from "react-router";

import Application from "./components/Application/Application.js";

import * as indexExampleRoutes from "./routes/IndexExample/routes.js";
import * as errorExampleRoutes from "./routes/ErrorExample/routes.js";
import * as flexboxExampleRoutes from "./routes/FlexboxExample/routes.js";
import * as helmetExampleRoutes from "./routes/HelmetExample/routes.js";
import * as prefetchExampleRoutes from "./routes/PrefetchExample/routes.js";

var Routes = (
    <Route path="/" component={Application}>
        <IndexRoute {...indexExampleRoutes} />

        <Route {...errorExampleRoutes} />
        <Route {...flexboxExampleRoutes} />
        <Route {...helmetExampleRoutes} />
        <Route {...prefetchExampleRoutes} />

        <Redirect from="/redirect" to="/flexbox-example" />
    </Route>
);

export default Routes;
