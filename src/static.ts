/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */
import fs from 'fs';
import nodePath from 'path';
import { Request, Response } from './types/index';
import fileTypes from './utils/file-types.js';

export default function serveStatic(
  req: Request,
  res: Response,
  staticOption?: string
) {
  if (staticOption && req.url?.includes(staticOption)) {
    const staticPath = nodePath.resolve(process.cwd());

    const stream = fs.createReadStream(nodePath.join(staticPath, req.url));
    const contentType = fileTypes(nodePath.join(staticPath, req.url));

    stream.on('error', (err) => {
      res.writeHead(404, { 'Content-Type': contentType });
      res.end(err.message);
    });

    stream.pipe(res);
  }
}
