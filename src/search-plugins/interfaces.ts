export interface SearchPlugin {
  addRecords: (records: any[]) => Promise<void>;
  generateConfig?: () => Promise<any>;
  init?: () => Promise<void>;
  finish?: () => Promise<void>;
}
