/*
 * merlee.js - router
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */

// const lower = require('../utils/lower');
import lower from '../utils/lower';
/**
 * @param  {object | function} options
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @param  {any} request
 * @param  {any} response
 */
module.exports = function router(options, req, res, request, response) {
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
};
