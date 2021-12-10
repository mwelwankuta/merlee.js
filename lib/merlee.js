/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021 - Present
 * MIT Licensed
 */

/**
 * module imports
 */

const http = require('http');
const morgan = require('morgan');

const logger = morgan('dev');

class Merlee {
  constructor(options) {
    this.options = options;
    this.server = http.createServer((req, res) => {
      const callback = () => {
        return { req, res };
      };

      this.handler({ path: '/', method: 'GET' }, callback);
    });
    this.server.setMaxListeners(0);
  }

  /**
   * @param  {HandlerOptions} options - `{ path: string, method: string }`
   * @param  {Callback} callback - `(req: Request, res: Response) => void`
   */

  handler(options, callback) {
    const { path, method } = options;

    this.server.on('request', (req, res) => {
      /**
       * Loggin with Morgan
       */
      logger(req, res, err => err && console.log('\nlogging with morgan'));

      const send = data => {
        const message = JSON.stringify(data.message);

        res.setHeader('Content-Length', Buffer.byteLength(message));
        res.setHeader('Content-Type', 'application/json');

        res.statusCode = data.status;
        res.end(message);
      };

      if (path === req.url && method === req.method) {
        if (req.method === 'GET') {
          const response = { ...res, send };
          return callback(req, response);
        }

        let body = {};
        req.on('data', data => {
          body = JSON.parse(data.toString());

          if (req.method === 'POST') {
            const response = { ...res, send };
            return callback({ ...req, body }, response);
          }

          /**
           * gabbage collection
           **/
          body = {};
        });
      }
    });
  }

  /**
   * @param  {(port : number) => void} callback
   */

  listen(callback) {
    const port = this.options.port;
    this.server.listen(port);

    if (callback) callback(port);
  }
}

/**
 * Expose `Merlee`
 */
exports = module.exports = Merlee;
