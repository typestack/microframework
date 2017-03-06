import * as express from "express";
import {MicroframeworkBootstrapSettings} from "../../src/MicroframeworkBootstrapSettings";
import {Routes} from "../controllers/controllers";

export function expressModule(settings: MicroframeworkBootstrapSettings) {

    // create express app
    const app = express();

    // register all routes
    const routes: any = Routes;
    Object.keys(routes).forEach(routePath => app.get(routePath, routes[routePath]));

    // run application to listen on given port
    app.listen(3000);

    // here we can set the data for other modules
    settings.setData("express_app", app);
}