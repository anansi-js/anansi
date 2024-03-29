import { SearchPlugin } from '../interfaces';

interface Endpoint {
  url: string;
  method?: 'POST' | 'GET';
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
