/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */

import http from 'http';
import fs from 'fs';
import morgan from 'morgan';
const logger = morgan('dev');
import parseUrl from 'parseurl';
import nodepath from 'path';
import ejs from 'ejs';
import fileTypes from './utils/file-types.js';
import body from './body.js';
import router from './router.js';
import _static from './static.js';
import lower from './utils/lower.js';
import { stringify, isJSON } from './utils/stringify.js';

class Merlee {
  /**
   *  @param {({
   *   port: number,
   *   views: string,
   *   static: string
   *  })} options merlee.js config
   */
  constructor(options = {}) {
    this.options = options;

    this.server = http.createServer((req, res) => {
      const callback = () => {
        return { req, res };
      };

      req.setEncoding('utf-8');

      logger(req, res, (err) => err && console.log('\nlogging with morgan'));
      this.handler({ path: null, method: '' }, callback);

      if (this.options.middleware) {
        const mw = this.options.middleware;
        let i = 0;
        const next = () => {
          i++;
          if (i < mw.length) {
            mw[i](req, res, next);
          }
        }
        if (mw.length > 0) {
          mw[0](req, res, next);
        }
      }
    });
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
   */
  //TODO: implement type for handler @param {(req: {...http.IncomingMessage, send: Function}, res: http.ServerResponse) => void} callback

  handler(options, callback) {
    const { path, method = 'get' } = options;

    this.server.on('request', (req, res) => {
      // error cannot set headers after they have been sent
      _static(req, res, this.options.static);
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

        console.log(response.length);

        if (isJSON(response)) {
          res.writeHead(status, {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(response, 'utf8'),
          });

          res.end(response);
        } else {
          res.writeHead(status, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': Buffer.byteLength(body, 'utf8'),
          });
          res.end(body);
        }
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
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end();
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

        const viewsPath = nodepath.resolve(
          process.cwd(),
          this.options?.views ?? 'views'
        );

        const responseFilePath = nodepath.join(viewsPath, fileName);

        const content = fs.readFileSync(responseFilePath, {
          encoding: 'utf8',
          flag: 'r',
        });

        const compileTemplate = ejs.compile(content);
        const html = compileTemplate(data);

        res.writeHead(status, {
          'Content-Type': 'text/html',
          'Content-Length': Buffer.byteLength(html, 'utf8'),
        });
        res.end(html);
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

        res.writeHead(status, {
          'Content-Type': contentType,
          'Content-Length': Buffer.byteLength(fileContent, 'utf8'),
        });
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
   *  start listening on a specified port
   * ```js
   * app.listen(port => console.log("listening on port " + port)
   * ```
   * @param  {(port : number) => void} callback
   * returns port server is running on
   */

  listen(callback) {
    const port = this.options.port;
    this.server.listen(port);

    if (callback) callback(port);
  }
}

/**
 * Expose Merlee
 * @param {{
 *  port: number,
 *  static: string
 * }} params
 * @returns
 */
export default function (params) {
  return new Merlee(params);
}
