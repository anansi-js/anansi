import { Pinecone, Index } from '@pinecone-database/pinecone';
import { SearchPlugin } from '../interfaces';
import { PineconePluginOptions, PineconeRecord } from './types';
import { ScrapedRecord } from '../../types';
import { GeneralPluginSettings } from '../generalPluginSettings';
export class PineconePlugin implements SearchPlugin {
  private client: Pinecone;
  private options: PineconePluginOptions;
  private index!: Index;

  constructor(options: PineconePluginOptions & GeneralPluginSettings) {
    if (!options.apiKey || !options.indexName) {
      throw new Error(
        'one or more of the following options is missing from the Pinecone plugin initializer: apiKey, indexName'
      );
    }
    this.options = options;
    this.client = new Pinecone({
      apiKey: options.apiKey
    });
  }

  async init(): Promise<void> {
    try {
      this.index = this.client.index(this.options.indexName);
      // Check if index exists, create if it doesn't
      const { indexes } = await this.client.listIndexes();
      if (!indexes?.some((index) => index.name === this.options.indexName)) {
        await this.client.createIndexForModel({
          name: this.options.indexName,
          cloud: this.options.cloud as any,
          region: this.options.region as any,
          embed: this.options.embed as any,
          waitUntilReady: true
        });
      }
    } catch (error) {
      console.error('Failed to initialize Pinecone plugin:', error);
      throw error;
    }
  }

  async addRecords(records: ScrapedRecord[]): Promise<void> {
    try {
      await this.index.upsert(records?.map((r) => ({ ...r, id: r.uniqueId })));
    } catch (error) {
      console.error('Failed to add records to Pinecone:', error);
      throw error;
    }
  }

  async finish(): Promise<void> {
    // Cleanup if needed
  }
}
