/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021 - Present
 * MIT Licensed
 */

/**
 * module imports
 */
const http = require('http');
const fs = require('fs');
const stream = require('stream');

const morgan = require('morgan');
const logger = morgan('dev');
const fileTypes = require('./fileTypes');

const nodepath = require('path');
const ejs = require('ejs');
const body = require('./body');
const _static = require('./static');

class Merlee {
  /**
   *  @param {({port: number, views: string, static: string})} options
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
   * @param  {{path: string, method:"get" | "post" | "put" | "delete"}} options
   * @param  {(req: http.IncomingMessage, res: http.ServerResponse) => void} callback
   */

  handler(options, callback) {
    const { path, method = 'get' } = options;

    this.server.on('request', (req, res) => {
      // error cannot set headers after they have been sent
      _static(req, res, this.options.static);

      /**
       * Loggin with Morgan
       */
      logger(req, res, err => err && console.log('\nlogging with morgan'));
      //  set views folder

      /**
       * sends back json data to the client status is 200 by default
       * ```js
       * res.send({message: 'hello world', status:200})
       * ```
       * @param {any} message
       * @param {number} status
       */
      const send = (message = '', status = 200) => {
        const response = JSON.stringify(message);

        res.statusCode = status;
        res.end(response);
      };

      /**
       * redirects request to a different path, by default redirects to the url `/`
       * ```js
       * res.redirect('/help')
       * ```
       * @param  {string} path
       */
      const redirect = (path = '/') => {
        req.url = path;
      };

      /**
       * sends back a html file to the client
       * ```js
       * res.render({file: 'hello.html', status:200})
       * ```
       * @param {string} file
       * @param {{any[any]}} data
       * @param {number} status
       */
      const render = (file = 'index', data, status = 200) => {
        let fileName = file;
        // extention
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
      };
      /**
       * ```js
       * res.sendFile('/path/to/file')
       * ```
       * @param  {string} file
       * @param  {number} status
       */
      const sendFile = (file, status = 200) => {
        let fileName = file;
        // extention
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
      };

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

      /**
       * get url search parameters from req.url
       */

      let params = {};

      if (req.url.split('?')[1]) {
        const pairs = req.url.split('?')[1].split('&');
        pairs.forEach(pair => {
          const key = pair.split('=')[0];
          const value = pair.split('=')[1];
          params[key] = value;
        });
      }

      /**
       *
       * @param {string} name
       * @returns {any}
       */

      const param = name => {
        return params[name];
      };

      const pathname = req.url.split('?')[0];
      const response = { ...res, send, render, sendFile, redirect };
      const request = { ...req, params, param };

      if (
        path === req.url &&
        method.toLowerCase() === req.method.toLowerCase()
      ) {
        if (req.method.toLowerCase() === 'get') {
          return callback(request, response);
        }

        req.on('data', data => body(req, response, data, callback));
      } else if (
        pathname === path &&
        method.toLowerCase() === req.method.toLowerCase()
      ) {
        if (req.method.toLowerCase() === 'get') {
          return callback(request, response);
        }

        req.on('data', data => body(req, response, data, callback));
      } else if (path !== req.url || pathname !== path) {
        res.statusCode = 404;
      }
      // reset status code
      res.statusCode = 200;
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
    let options = this.options;
    const newOption = { [option]: value };

    this.options = { ...options, ...newOption };
  }

  /**
   *  start listening on a specified port
   * ```js
   * app.listen(port => console.log("listening on port " + port)
   * ```
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
