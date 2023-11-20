/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */

/**
 * module imports
 */
import fs from 'fs';
import http from 'http';
import logger from 'dev';
import parseUrl from 'parseurl';
import ejs from 'ejs';
import nodepath from 'path';
import body from './body';
import { fileTypes } from './file-types';
import router from './router';
import _static from './static';
import lower from './utils/lower';
import stringify from './utils/stringify';

class Merlee {
  options: any;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  /**
   *  @param {({
   *   port: number,
   *   views: string,
   *   static: string
   *  })} options merlee.js config
   */
  constructor(options) {
    this.options = options;

    this.server = http.createServer((req, res) => {
      const callback = () => {
        return { req, res };
      };
      req.setEncoding('utf-8');

      this.handler({ path: null, method: '' }, callback);
    });
    this.server.setMaxListeners(0);
  }

  /**
   * handle http methods. by default method is set to `GET`
   * ```js
   * handler({method: "GET", path:"/"}, (req, res) => {
   *    res.send({name: "merlee.js", language:"javascript"})
   * })
   * ```
   * @param  {{
   *   path: string,
   *   method:"get" | "post" | "put" | "delete"
   * }} options
   * @param  {
   *   (req: http.IncomingMessage, res: http.ServerResponse) => void
   * } callback
   */

  handler(options, callback) {
    const { path, method = 'get' } = options;

    this.server.on('request', (req, res) => {
      // error cannot set headers after they have been sent
      _static(req, res, this.options.static);

      /**
       * Logging with Morgan
       */

      logger(req, res, (err) => err && console.log('\nlogging with morgan'));
      //  set views folder

      /**
       * get url search parameters from req.url
       */

      const params = {};

      const { query } = parseUrl(req);
      const search = new URLSearchParams(query);

      if (search) {
        const pairs = search.toString().split('&');

        pairs.forEach((pair) => {
          const key = pair.split('=')[0];
          const value = pair.split('=')[1];
          params[key] = value;
        });
      }

      /**
       * gets request param by name
       * ```js
       * req.param('query')
       * ```
       * @param {string} name
       * @return {any}
       */
      function param(name) {
        if (params[name]) {
          return params[name];
        }
        return '';
      }

      /**
       * sends back json data to the client status is 200 by default
       * ```js
       * res.send({message: 'hello world', status:200})
       * ```
       * @param {any} body
       * @param {number} status
       */
      function send(body, status = 200) {
        let response = '';
        try {
          response = stringify(body);
        } catch (error) {
          console.error(new Error(error));
        }

        res.statusCode = status;
        res.end(response);
      }

      const reqUrl = req.url.split('?')[0];
      const response = { ...res, send, render, sendFile, redirect };
      const request = { ...req, params, param };

      // request is from router
      if (typeof options == 'function') {
        return router(options, req, res, request, response);
      } else {
        if (path === reqUrl && lower(method) === lower(req.method)) {
          if (lower(req.method) === 'get') return callback(request, response);

          // request contains data
          return req.on('data', (data) => body(req, response, data, callback));
        }
        return () => {
          res.statusCode = 404;
          res.end();
          res.statusCode = 200;
        };
      }

      /**
       * redirects request to a different path,
       * by default redirects to the url `/`
       * ```js
       * res.redirect('/help')
       * ```
       * @param  {string} path
       */
      function redirect(path = '/') {
        req.url = path;
      }

      /**
       * sends back a html file to the client
       * ```js
       * res.render({file: 'hello.html', status:200})
       * ```
       * @param {string} file
       * @param {{any[any]}} data
       * @param {number} status
       */

      function render(file = 'index', data, status = 200) {
        let fileName = file;
        // extension
        if (!nodepath.extname(file)) fileName = `${file}.ejs`;

        let viewsPath = '';
        let fileContent = '';

        try {
          viewsPath = nodepath.resolve(process.cwd(), 'views');
          const responseFilePath = nodepath.join(viewsPath, fileName);
          fileContent = fs.readFileSync(responseFilePath, {
            encoding: 'utf8',
            flag: 'r',
          });
        } catch (error) {
          try {
            viewsPath = nodepath.resolve(process.cwd(), this.options.views);
            const responseFilePath = nodepath.join(viewsPath, fileName);
            fileContent = fs.readFileSync(responseFilePath, {
              encoding: 'utf8',
              flag: 'r',
            });
          } catch (error) {
            // should this be here??
            console.error('You likely forgot to set a views folder');
            console.error(error);
            process.exit(1);
          }
        }

        const compleEjs = ejs.compile(fileContent);
        const compiledEjs = compleEjs(data);

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', compiledEjs.length);
        res.statusCode = status;
        res.end(compiledEjs);
      }
      /**
       * ```js
       * res.sendFile('/path/to/file')
       * ```
       * @param  {string} file
       * @param  {number} status
       */
      function sendFile(file, status = 200) {
        let fileName = file;
        // extension
        if (!nodepath.extname(file)) fileName = `${file}.html`;

        let fileContent = '';

        const currentDirectory = nodepath.resolve(process.cwd());
        const responseFilePath = nodepath.join(currentDirectory, fileName);
        const contentType = fileTypes(responseFilePath);
        fileContent = fs.readFileSync(responseFilePath, {
          encoding: 'utf8',
          flag: 'r',
        });

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', fileContent.length);
        res.statusCode = status;
        res.end(fileContent);
      }

      /**
       *
       * @param {string} url
       */

      // serve static files
      /**
       * @param  {http.IncomingMessage} req
       * @param  {http.ServerResponse} res
       * @param  {string} this.options.static
       */
    });
  }

  /**
   * set application options
   * ```js
   * app.set('port', 3000)
   * ```
   * @param {option: string} option
   * @param {value: string | number} value
   */

  set(option, value) {
    const options = this.options;
    const newOption = { [option]: value };

    this.options = { ...options, ...newOption };
  }

  /**
   *  start listening on a specified port
   * ```js
   * app.listen(port => console.log("listening on port " + port)
   * ```
   * returns port server is running on
   */

  listen(callback: (port: number) => void) {
    const port = this.options.port;
    this.server.listen(port);

    if (callback) callback(port);
  }
}

function exposeMerlee(params) {
  return new Merlee(params);
}

/**
 * Expose `Merlee`
 */
exports = module.exports = exposeMerlee;
