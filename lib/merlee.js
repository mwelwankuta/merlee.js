/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021 - Present
 * MIT Licensed
 */

/**
 * module imports
 */
const http = require("http");
const fs = require("fs");
const morgan = require("morgan");
const logger = morgan("dev");
const nodepath = require("path");
const ejs = require("ejs");
const request = require("./request");
const _static = require("./static");

class Merlee {
  /**
   * default port `3000`
   * default static folder `public`
   * default views folder `views`
   *  @param {({port: number, views: string, static: string})} options
   */
  constructor(options) {
    this.options = options;

    this.server = http.createServer((req, res) => {
      const callback = () => {
        return { req, res };
      };

      this.handler({ path: "/", method: "GET" }, callback);
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
   * @param  {(path: string, method:string) => void} options
   * @param  {(req: http.IncomingMessage, res: http.ServerResponse) => void} callback
   */

  handler(options, callback) {
    const { path, method = "GET" } = options;

    this.server.on("request", (req, res) => {
      // reset status code
      res.statusCode = 200;

      /**
       * Loggin with Morgan
       */
      logger(req, res, (err) => err && console.log("\nlogging with morgan"));
      //  set views folder

      /**
       * sends back json data to the client status is 200 by default
       * ```js
       * res.send({message: 'hello world', status:200})
       * ```
       * @param {any} message
       * @param {number} status
       */
      const send = (message = "built with merlee.js", status = 200) => {
        const response = JSON.stringify(message);

        res.setHeader("Content-Length", Buffer.byteLength(response));
        res.setHeader("Content-Type", "application/json");

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
      const redirect = (path = "/") => {
        req.url = path;
      };

      /**
       * sends back a html file to the client
       * ```js
       * res.render({file: 'hello.html', status:200})
       * ```
       * @param {string} file
       * @param {{any}} data
       * @param {number} status
       */
      const render = (file = "index", data, status = 200) => {
        let fileName = file;
        // extention
        if (!nodepath.extname(file)) fileName = `${file}.ejs`;

        let viewsPath = "";
        let fileContent = "";

        try {
          viewsPath = nodepath.resolve(process.cwd(), "views");
          const responseFilePath = nodepath.join(viewsPath, fileName);
          fileContent = fs.readFileSync(responseFilePath, {
            encoding: "utf8",
            flag: "r",
          });
        } catch (error) {
          try {
            viewsPath = nodepath.resolve(process.cwd(), views);
            const responseFilePath = nodepath.join(viewsPath, fileName);
            fileContent = fs.readFileSync(responseFilePath, {
              encoding: "utf8",
              flag: "r",
            });
          } catch (error) {
            // should this be here??
            console.error("You likely forgot to set a views folder");
            console.error(error);
            process.exit(1);
          }
        }

        res.setHeader("Content-Length", Buffer.byteLength(fileContent));
        res.setHeader("Content-Type", "text/html");

        const compleEjs = ejs.compile(fileContent);
        const compiledEjs = compleEjs(data);
        res.statusCode = status;
        res.end(compiledEjs);
      };

      // serve static files
      /**
       * @param  {http.IncomingMessage} req
       * @param  {http.ServerResponse} res
       * @param  {string} this.options.static
       */
      _static(req, res, this.options.static);

      if (path === req.url && method === req.method) {
        // combined  response methods
        const response = { ...res, send, render, redirect };

        if (req.method === "GET" || req.method === "get") {
          return callback(req, response);
        }

        req.on("data", (data) => request(req, response, data, callback));
      } else if (req.url !== path) {
        res.statusCode = 404;
        res.end();
      }
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
   * start listening on a specified port
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
module.exports.Melree = Merlee;
exports = module.exports = Merlee;
