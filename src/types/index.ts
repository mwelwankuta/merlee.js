import { Data } from 'ejs';
import { IncomingMessage, ServerResponse } from 'http';

export interface Response extends ServerResponse {
  send: (data: any, status?: number) => void;
  render: (file: string, data: Data, status: number) => void;
  sendFile: (file: string, status: number) => void;
  redirect: (path: string) => void;
}
export interface Request<T = any> extends IncomingMessage {
  query: unknown;
  params: Record<string, string>;
  param: (name: string) => string;
  body?: T;
}

export interface HandlerCallback {
  (req: Request<any>, res: Response, next: NextFunction): void;
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
  req: Request<any>,
  res: Response,
  next: NextFunction
) => void;
