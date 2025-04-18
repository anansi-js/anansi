import { Client } from '@elastic/elasticsearch';
import { SearchPlugin } from '../interfaces';
import { ElasticsearchPluginOptions } from './types';
import { ScrapedRecord } from '../../types';
import { GeneralPluginSettings } from '../generalPluginSettings';

export class ElasticsearchPlugin implements SearchPlugin {
  private client: Client;
  private options: ElasticsearchPluginOptions;
  private indexName: string;

  constructor(options: ElasticsearchPluginOptions & GeneralPluginSettings) {
    if (!options.node || !options.indexName) {
      throw new Error('Elasticsearch plugin requires node and indexName');
    }

    this.options = options;
    this.indexName = options.indexName;

    const clientConfig: any = {
      node: options.node
    };

    if (options.username && options.password) {
      clientConfig.auth = {
        username: options.username,
        password: options.password
      };
    } else if (options.apiKey) {
      clientConfig.auth = {
        apiKey: options.apiKey
      };
    }

    this.client = new Client(clientConfig);
  }

  async init(): Promise<void> {
    try {
      // Check if index exists
      const indexExists = await this.client.indices.exists({
        index: this.indexName
      });

      if (!indexExists) {
        // Create index with custom mapping and settings if provided
        await this.client.indices.create({
          index: this.indexName,
          mappings: this.options.mapping || {
            properties: {
              uniqueId: { type: 'keyword' },
              url: { type: 'keyword' },
              fullUrl: { type: 'keyword' },
              content: { type: 'text' },
              title: { type: 'text' },
              hierarchy: {
                properties: {
                  l0: { type: 'text' },
                  l1: { type: 'text' },
                  l2: { type: 'text' },
                  l3: { type: 'text' },
                  l4: { type: 'text' },
                  content: { type: 'text' }
                }
              },
              weight: {
                properties: {
                  level: { type: 'integer' },
                  pageRank: { type: 'float' },
                  position: { type: 'integer' }
                }
              },
              metadata: { type: 'object' }
            }
          },
          settings: this.options.settings || {
            analysis: {
              analyzer: {
                default: {
                  type: 'standard'
                }
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize Elasticsearch plugin:', error);
      throw error;
    }
  }

  async addRecords(records: ScrapedRecord[]): Promise<void> {
    try {
      const operations = records.flatMap((record) => [
        { index: { _index: this.indexName, _id: record.uniqueId } },
        record
      ]);

      await this.client.bulk({
        refresh: true,
        operations
      });
    } catch (error) {
      console.error('Failed to add records to Elasticsearch:', error);
      throw error;
    }
  }

  async finish(): Promise<void> {
    // Cleanup if needed
  }
}
