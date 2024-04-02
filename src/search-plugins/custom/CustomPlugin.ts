import { GeneralPluginSettings, SearchPlugin } from '../interfaces';
import { ScrapedRecord } from '../../types';
import { CustomPluginOptions } from './types';
import { injectUrlParams } from '../../utils';

export class CustomPlugin implements SearchPlugin {
  private opts: Partial<CustomPluginOptions & GeneralPluginSettings>;

  constructor(opts: Partial<CustomPluginOptions & GeneralPluginSettings>) {
    this.opts = opts;
  }

  async init() {
    if (this.opts.endpoints?.init?.url) {
      const url = injectUrlParams({
        url: this.opts.endpoints?.init?.url,
        pathParams: this.opts.endpoints?.init?.pathParams,
        queryParams: this.opts.endpoints?.init.queryParams
      });
      await fetch(url, {
        method: this.opts.endpoints?.init?.method || 'POST',
        ...(this.opts.endpoints?.init?.method !== 'GET' && {
          body:
            this.opts.endpoints?.init?.getBody?.() ||
            JSON.stringify({ message: 'INIT!' })
        }),
        ...(this.opts.endpoints?.init?.headers && {
          headers: this.opts.endpoints?.init?.headers
        })
      });
    } else if (this.opts.init) {
      await this.opts.init();
    }
  }

  async addRecords(newRecords: ScrapedRecord[]) {
    if (this.opts.endpoints?.addRecords?.url) {
      const url = injectUrlParams({
        url: this.opts.endpoints?.addRecords?.url,
        pathParams: this.opts.endpoints?.addRecords?.pathParams,
        queryParams: this.opts.endpoints?.addRecords.queryParams
      });
      await fetch(url, {
        method: 'POST',
        body:
          this.opts.endpoints?.addRecords?.getBody?.(newRecords) ||
          JSON.stringify({
            message: 'ADD RECORDS!',
            data: newRecords
          }),
        ...(this.opts.endpoints?.addRecords?.headers && {
          headers: this.opts.endpoints?.addRecords?.headers
        })
      });
    } else if (this.opts.addRecords) {
      await this.opts.addRecords(newRecords);
    }
  }

  async finish() {
    if (this.opts.endpoints?.finish?.url) {
      const url = injectUrlParams({
        url: this.opts.endpoints?.finish?.url,
        pathParams: this.opts.endpoints?.finish?.pathParams,
        queryParams: this.opts.endpoints?.finish.queryParams
      });
      await fetch(url, {
        method: this.opts.endpoints?.finish?.method || 'POST',
        ...(this.opts.endpoints?.finish?.method !== 'GET' && {
          body:
            this.opts.endpoints?.finish?.getBody?.() ||
            JSON.stringify({ message: 'FINISH!' })
        }),
        ...(this.opts.endpoints?.finish?.headers && {
          headers: this.opts.endpoints?.finish?.headers
        })
      });
    } else if (this.opts.finish) {
      await this.opts.finish();
    }
  }
}
