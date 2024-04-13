import { SearchPlugin } from '../interfaces';
import { ScrapedRecord } from '../../types';
import { CustomPluginOptions } from './types';
import { injectUrlParams } from '../../utils';
import { GeneralPluginSettings } from '../types';

export class CustomPlugin implements SearchPlugin {
  private opts: Partial<CustomPluginOptions & GeneralPluginSettings>;

  constructor(opts: Partial<CustomPluginOptions & GeneralPluginSettings>) {
    this.opts = opts;
  }

  async init() {
    if (this.opts.endpoints?.init?.url) {
      const endpoint = this.opts.endpoints?.init;
      const {
        url,
        pathParams,
        queryParams,
        method = 'POST',
        getBody,
        headers
      } = endpoint;
      const fetchUrl = injectUrlParams({
        url,
        pathParams,
        queryParams
      });
      await fetch(fetchUrl, {
        method,
        ...(method !== 'GET' && {
          body: getBody?.() || JSON.stringify({ message: 'INIT!' })
        }),
        ...(headers && {
          headers
        })
      });
    } else if (this.opts.init) {
      await this.opts.init();
    }
  }

  async addRecords(newRecords: ScrapedRecord[]) {
    if (this.opts.endpoints?.addRecords?.url) {
      const endpoint = this.opts.endpoints?.addRecords;
      const { url, pathParams, queryParams, getBody, headers } = endpoint;
      const fetchUrl = injectUrlParams({
        url,
        pathParams,
        queryParams
      });
      await fetch(fetchUrl, {
        method: 'POST',
        body:
          getBody?.(newRecords) ||
          JSON.stringify({
            message: 'ADD RECORDS!',
            data: newRecords
          }),
        ...(headers && {
          headers
        })
      });
    } else if (this.opts.addRecords) {
      await this.opts.addRecords(newRecords);
    }
  }

  async finish() {
    if (this.opts.endpoints?.finish?.url) {
      const endpoint = this.opts.endpoints?.finish;
      const {
        url,
        pathParams,
        queryParams,
        method = 'POST',
        getBody,
        headers
      } = endpoint;
      const fetchUrl = injectUrlParams({
        url,
        pathParams,
        queryParams
      });
      await fetch(fetchUrl, {
        method,
        ...(method !== 'GET' && {
          body: getBody?.() || JSON.stringify({ message: 'FINISH!' })
        }),
        ...(headers && {
          headers
        })
      });
    } else if (this.opts.finish) {
      await this.opts.finish();
    }
  }
}
