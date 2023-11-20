/*
 * merlee.js - body
 * Copyright © Mwelwa Nkuta 2021
 * MIT Licensed
 */

import { IncomingMessage, ServerResponse } from 'http';
import lower from './utils/lower';

interface BodyHandlers {
  req: IncomingMessage;
  response: ServerResponse;
  data: string;
  callback: (req: IncomingMessage, res: ServerResponse) => void;
}

export default function bodyHandlers({
  callback,
  data,
  req,
  response,
}: BodyHandlers) {
  let body = {};

  try {
    body = JSON.parse(data.toString());
  } catch (error) {
    // parse formData
    // function to parse formdata

    const parseFormData = (data, callback) => {
      const formData = {};
      const dataArray = data.toString().split('&');
      // convert formData to utfs8 and store in lang variable
      dataArray.forEach((lang) => {
        const [key, value] = lang.split('=');
        formData[key] = decodeURIComponent(value);
      });

      callback(formData);
    };

    parseFormData(data, (parsedData) => {
      body = parsedData;
    });
  }

  const request = { ...req, body } as IncomingMessage & { body: string };
  if (lower(req.method) === 'post') {
    return callback(request, response);
  } else if (lower(req.method) === 'put') return callback(request, response);
  else if (lower(req.method) === 'delete') return callback(request, response);

  /**
   * garbage collection
   **/
  body = {};
}
