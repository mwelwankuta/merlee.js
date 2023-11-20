/*
 * merlee.js - router
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */

import { IncomingMessage, ServerResponse } from 'http';
import lower from '../utils/lower';
/**
 * @param  {object | function} options
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @param  {any} request
 * @param  {any} response
 */

interface RouterParams {
  options: object | Function;
  req: IncomingMessage;
  res: ServerResponse;
  request: any;
  response: any;
}
export default function router(
  options: object | Function,
  req: IncomingMessage,
  res: ServerResponse,
  request: any,
  response: any
) {
  const routerRoutes = typeof options == 'function' ? options() : options;

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
