/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */
// const fs = require('fs');
import fs from 'fs';
// const nodePath = require('path');
import nodePath from 'path';
// const fileTypes = require('./fileTypes');
import fileTypes from './fileTypes';

/**
 * @param {require("http").IncomingMessage} req
 * @param {require("http").ServerResponse} res
 * @param {string} staticOption
 */

//Changed static to serveStatic as "static" is a reserved word now.
module.exports = function serveStatic(req, res, staticOption) {
  if (req.url.includes(staticOption)) {
    const staticPath = nodePath.resolve(process.cwd());

    const stream = fs.createReadStream(nodePath.join(staticPath, req.url));
    const contentType = fileTypes(nodePath.join(staticPath, req.url));

    stream.on('error', (err) => {
      res.writeHead(404, { 'Content-Type': contentType });
      res.end(err.message);
    });
    stream.pipe(res);
  }
};
