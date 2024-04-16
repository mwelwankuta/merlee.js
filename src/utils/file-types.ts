/*
 * merlee.js
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */
import path from 'path';

export default function fileTypes(filePath: string) {
  let contentType = 'text/html';

  switch (path.extname(filePath)) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.css':
      contentType = 'text/css';
      break;

    case '.js':
      contentType = 'application/javascript';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case 'css':
      contentType = 'text/css';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.xml':
      contentType = 'text/xml';
      break;
    case '.pdf':
      contentType = 'application/pdf';
      break;
    case '.zip':
      contentType = 'application/zip';
      break;
    case '.mp3':
      contentType = 'audio/mpeg';
      break;
    case '.mp4':
      contentType = 'video/mp4';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
    case '.woff':
      contentType = 'application/font-woff';
      break;
    case '.woff2':
      contentType = 'application/font-woff2';
      break;
    case '.ttf':
      contentType = 'application/font-ttf';
      break;
    case '.eot':
      contentType = 'application/vnd.ms-fontobject';
      break;
    case '.otf':
      contentType = 'application/font-otf';
      break;
    default:
      contentType = 'text/plain';
      break;
  }
  return contentType;
}
