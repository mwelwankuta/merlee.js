/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021 - Present
 * MIT Licensed
 */
const http = require('http');
const fs = require('fs');
const nodepath = require('path');
const fileTypes = require('./fileTypes');

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} staticOption
 */

module.exports = function static(req, res, staticOption) {
  if (req.url.includes(staticOption)) {
    const staticPath = nodepath.resolve(process.cwd());
    const stream = fs.createReadStream(nodepath.join(staticPath, req.url));
    const contentType = fileTypes(nodepath.join(staticPath, req.url));
    stream.on('error', err => {
      res.writeHead(404, { 'Content-Type': contentType });
      res.end(err.message);
    });
    stream.pipe(res);
  }
};
