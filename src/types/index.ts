import { Data } from 'ejs';
import { IncomingMessage, ServerResponse } from 'http';

export interface Response extends ServerResponse {
  send: (data: any, status?: number) => void;
  render: (file: string, data: Data, status: number) => void;
  sendFile: (file: string, status: number) => void;
  redirect: (path: string) => void;
}
export interface Request extends IncomingMessage {
  query: unknown;
  params: Record<string, string>;
  param: (name: string) => string;
  body?: any;
}

export interface HandlerCallback {
  (req: Request, res: Response): void;
}

type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'get'
  | 'post'
  | 'put'
  | 'delete';

export interface HandlerOptions {
  path: string;
  method?: RequestMethod;
  middleware?: HandlerFunction[];
}

export type NextFunction = (err?: Error) => void;
export type HandlerFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void;
