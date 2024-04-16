/*
 * merlee.js - router
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */

import { Request, Response } from './types/index.js';
import lower from './utils/lower.js';

// TODO: options can either be function or record?
export default function router<T extends Function>(
  options: T,
  req: Request,
  res: Response,
  request: unknown,
  response: unknown
) {
  const routerRoutes = options();

  for (const routerRoute in routerRoutes) {
    if (Object.prototype.hasOwnProperty.call(routerRoutes, routerRoute)) {
      const { path, callback } = routerRoutes[routerRoute];

      const method = routerRoute;

      try {
        const isSameRoute =
          req.url == lower(path) && lower(req.method) == lower(method);

        if (isSameRoute) {
          return callback(request, response);
        }
      } catch (error) {
        console.error(new Error(error));
        process.exit(1);
      }

      res.writeHead(200);
    }
  }
}
