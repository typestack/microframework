import * as express from 'express';
import { MicroframeworkSettings } from '../../src/MicroframeworkSettings';
import { Routes } from '../controllers/controllers';

export function expressLoader(settings: MicroframeworkSettings) {
  // create express app
  const app = express();

  // register all routes
  const routes: any = Routes;
  Object.keys(routes).forEach(routePath => app.get(routePath, routes[routePath]));

  // run application to listen on given port
  app.listen(3000);

  // here we can set the data for other loaders
  settings.setData('express_app', app);
}
