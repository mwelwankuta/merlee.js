/*
 * merlee.js - body
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */

import lower from './utils/lower';

/**
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} response
 * @param  {string} data
 * @param  {(req: http.IncomingMessage, res: ServerResponse) => void} callback
 */
export default function bodyHandlers(req, response, data, callback) {
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

  const request = { ...req, body };
  if (lower(req.method) === 'post') {
    return callback(request, response);
  } else if (lower(req.method) === 'put') return callback(request, response);
  else if (lower(req.method) === 'delete') return callback(request, response);

  /**
   * garbage collection
   **/
  body = {};
}
