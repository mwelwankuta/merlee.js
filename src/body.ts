/*
 * merlee.js - body
 * Copyright © Mwelwa Nkuta 2024
 * MIT Licensed
 */

import { HandlerCallback, Request, Response } from './types/index.js';

export type FormData = Record<string, string>;

export const httpVerb = {
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

export default function bodyHandlers(
  req: Request,
  response: Response,
  data: string,
  callback: HandlerCallback
) {
  let body = {};

  try {
    body = JSON.parse(data.toString());
  } catch (error) {
    // parse formData
    // function to parse formdata

    const parseFormData = (
      data: string,
      callback: (data: FormData) => void
    ) => {
      const formData: Record<string, string> = {};

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

  return callback({ ...req, body } as unknown as Request, response);
}
