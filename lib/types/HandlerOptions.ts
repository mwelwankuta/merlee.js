/*
 add more methods 
*/

export interface HandlerOptions {
  path: string;
  method?: 'GET' | 'POST';
  middleware?: Function;
}
