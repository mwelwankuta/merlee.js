/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */
import { createReadStream } from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';
import nodePath from 'path';
import { fileTypes } from './file-types';

export function staticFiles(
  req: IncomingMessage,
  res: ServerResponse,
  staticOption: string
) {
  if (req?.url?.includes(staticOption)) {
    const staticPath = nodePath.resolve(process.cwd());

    const stream = createReadStream(nodePath.join(staticPath, req.url));
    const contentType = fileTypes(nodePath.join(staticPath, req.url));

    stream.on('error', (err) => {
      res.writeHead(404, { 'Content-Type': contentType });
      res.end(err.message);
    });
    stream.pipe(res);
  }
}
