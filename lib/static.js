const fileTypes = require('./fileTypes');
const nodepath = require('path');
const fs = require('fs');

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} staticOption
 */
module.exports = function static(req, res, staticOption) {
  if (req.url.includes(staticOption)) {
    const staticPath = nodepath.resolve(process.cwd());
    const filePath = nodepath.join(staticPath, req.url);

    // set conent based on file type
    let contentType = '';
    contentType = fileTypes(filePath);

    // serve static files
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return res.end(err);
      }

      if (stats.isFile()) {
        const fileStream = fs.createReadStream(filePath);

        fileStream.on('open', () => {
          res.setHeader('Content-Length', stats.size);
          res.setHeader('Content-Type', contentType);
          fileStream.pipe(res);
        });

        fileStream.on('error', err => {
          console.error(err);
          res.end(err);
        });
      } else {
        res.statusCode = 404;
      }
    });
  }
};
