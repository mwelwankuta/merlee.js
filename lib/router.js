/*
 * merlee.js - router
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */

import lower from './utils/lower.js';

/**
 * @param  {object | function} options
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @param  {any} request
 * @param  {any} response
 */
export default function router(options, req, res, request, response) {
  const routerRoutes = options();

  const sendResponse = (callback) => {
    return callback(request, response);
  };

  for (const routerRoute in routerRoutes) {
    if (Object.prototype.hasOwnProperty.call(routerRoutes, routerRoute)) {
      const { path, callback } = routerRoutes[routerRoute];

      const method = routerRoute;

      try {
        const isSameRoute =
          req.url == lower(path) && lower(req.method) == lower(method);

        if (isSameRoute) {
          sendResponse(callback);
          return;
        }
      } catch (error) {
        console.error(new Error(error));
        process.exit(1);
      }

      res.writeHead(200);
    }
  }
}
