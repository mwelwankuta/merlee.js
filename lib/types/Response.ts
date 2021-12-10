export interface Response {
  send: (response: { message: string; status: number }) => void;
  render: (file: string) => void;
  status: number;
  url: string;
  ok: boolean;
  end: Function;
  statusCode: number;
  setHeader: Function;
}

export interface Request {
  params: any;
  method: string;
  body: any;
  url: string;
  on?: any;
  headers: Headers;
}
