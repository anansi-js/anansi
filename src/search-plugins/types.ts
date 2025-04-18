import { AlgoliaPluginOptions } from './algolia/types';
import { CustomPluginOptions } from './custom/types';
import { PineconePluginOptions } from './pinecone/types';
import { ElasticsearchPluginOptions } from './elasticsearch/types';
import { GeneralPluginSettings } from './generalPluginSettings';

export type SearchEngineName =
  | 'algolia'
  | 'elasticsearch'
  | 'test'
  | 'custom'
  | 'pinecone';

export interface SearchPluginOptions {
  generalSettings: GeneralPluginSettings;

  /** specifies the search engine */
  engine: SearchEngineName;
  /** algolia specific optins */
  algolia?: AlgoliaPluginOptions;
  /** elasticsearch specific optins */
  elasticsearch?: ElasticsearchPluginOptions;
  /** custom plugin specific optins */
  custom?: CustomPluginOptions;
  /** pinecone specific options */
  pinecone?: PineconePluginOptions;
}
