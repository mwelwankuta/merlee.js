/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */

import ejs, { Data } from 'ejs';
import fs from 'fs';
import http, { IncomingMessage } from 'http';
import morgan from 'morgan';
import parseUrl from 'parseurl';
import nodepath from 'path';
import body from './body.js';
import router from './router';
import _static from './static';
import {
  HandlerCallback,
  HandlerFunction,
  HandlerOptions,
} from './types/index.js';
import fileTypes from './utils/file-types.js';
import lower from './utils/lower.js';
import { isJSON, stringify } from './utils/stringify.js';
import { Request, Response } from './types/index.js';

const logger = morgan('dev');

interface MerleeOptions {
  port: number | string;
  views?: string;
  static?: string;
  middleware?: HandlerFunction[];
}

class Merlee {
  options: MerleeOptions = {
    port: 0,
    views: '',
    static: '',
    middleware: [],
  };
  server: http.Server;

  constructor(options: MerleeOptions) {
    this.options = options;

    this.server = http.createServer((req, res) => {
      req.setEncoding('utf-8');

      logger(req, res, (err) => err && console.log('\nlogging with morgan'));
    });
  }

  /**
   * handle http methods. by default method is set to `GET`
   * ```js
   * handler({method: "GET", path:"/"}, (req, res) => {
   *    res.send({name: "merlee.js", language:"javascript"})
   * })
   * ```
   */

  handler(options: HandlerOptions, callback: HandlerCallback) {
    const { path, method = 'get' } = options;

    this.server.on('request', (req: Request, res: Response) => {
      // error cannot set headers after they have been sent
      _static(req, res, this.options.static);

      // go through all the middleware and check if the "next" function has been called in the last
      // middleware

      let cmw = 0; // current middleware
      const midw = this.options.middleware;
      let calledNextAtEnd = false;

      const next = () => {
        if (midw && cmw < midw.length - 1) {
          cmw++;
          midw[cmw](req, res, next);
        } else if (midw && cmw == midw.length - 1) {
          calledNextAtEnd = true;
        }
      };

      if (midw && midw?.length > 0) {
        midw[0](req, res, next);
        if (!calledNextAtEnd) {
          return; // return if next was not called at the end of the middleware chain
        }
      }

      /**
       * get url search parameters from req.url
       */
      const params: Record<string, string> = {};

      const url = parseUrl(req as unknown as IncomingMessage);

      if (url?.query) {
        const search = new URLSearchParams(url.query as Record<string, string>);
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
       */
      function param(name: string): string {
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
       */
      function send(body: unknown, status = 200) {
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
            'Content-Length': Buffer.byteLength(body as string, 'utf8'),
          });
          res.end(body);
        }
      }

      /**
       * sends back a html file to the client
       * ```js
       * res.render({file: 'hello.html', status:200})
       * ```
       */

      const render = (file = 'index', data: Data, status = 200) => {
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
      };

      const reqUrl = req.url?.split('?')[0];
      const response = {
        ...res,
        send,
        render,
        sendFile,
        redirect,
      } as unknown as Response;

      const request = { ...req, params, param } as unknown as Request;

      // request is from router
      if (typeof options != 'function') {
        if (path === reqUrl && lower(method) === lower(req.method)) {
          if (lower(req.method) === 'get') return callback(request, response);

          // request contains data
          return req.on('data', (data) => body(req, response, data, callback));
        }

        return () => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end();
        };
      } else {
        return router(options, req, res, request, response);
      }

      /**
       * redirects request to a different path,
       * by default redirects to the url `/`
       * ```js
       * res.redirect('/help')
       * ```
       */
      function redirect(path: string = '/') {
        req.url = path;
      }

      /**
       * ```js
       * res.sendFile('/path/to/file')
       * ```
       */
      function sendFile(file: string, status = 200) {
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
   */
  listen(callback: (port: number | string) => void) {
    const port = this.options.port;
    this.server.listen(port);

    if (callback) callback(port);
  }
}

/**
 * Expose Merlee
 */
export default function merlee(params: MerleeOptions) {
  return new Merlee(params);
}

export * from './types/index';
