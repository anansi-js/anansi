import { ScrapedRecord } from '../types';

export interface SearchPlugin {
  addRecords: (records: ScrapedRecord[]) => Promise<void>;
  generateConfig?: () => Promise<any>;
  init?: () => Promise<void>;
  finish?: () => Promise<void>;
}
