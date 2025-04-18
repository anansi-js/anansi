import { z } from 'zod';
// import { GeneralPluginSettings } from '../types';

// export interface AlgoliaPluginOptions extends GeneralPluginSettings {
//   apiKey: string;
//   appId: string;
//   indexName: string;
//   customConfig?: Record<string, unknown> | string; // config object or file path
// }

export const AlgoliaPluginOptionsSchema = z.object({
  apiKey: z.string(),
  appId: z.string(),
  indexName: z.string(),
  customConfig: z.union([z.record(z.any()), z.string()]).optional()
});

export type AlgoliaPluginOptions = z.infer<typeof AlgoliaPluginOptionsSchema>;
