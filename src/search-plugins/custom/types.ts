import { SearchPlugin } from '../interfaces';

interface Endpoint {
  url: string;
  method?: 'POST' | 'GET';
  queryParams?: Record<string, any>;
  pathParams?: Record<string, any>;
  headers?: Record<string, string>;
  getBody?: (args?: any) => any;
}

export interface CustomPluginOptions extends SearchPlugin {
  endpoints?: {
    init?: Endpoint;
    addRecords: Endpoint;
    finish?: Endpoint;
  };
}
