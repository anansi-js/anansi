import { SearchPlugin } from '../interfaces';

export interface AlgoliaPluginOptions extends SearchPlugin {
  apiKey: string;
  appId: string;
  indexName: string;
  customConfig?: Record<string, unknown> | string; // config object or file path
}
