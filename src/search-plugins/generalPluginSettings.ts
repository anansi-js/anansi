import { z } from 'zod';

export const GeneralPluginSettingsSchema = z.object({
  /** should index records that did not originate in a site crawl be kept after re-populating the index
   * with new site crawl records. Useful if the site search index includes entries from sources other than the crawler */
  keepNonCrawlerRecords: z.boolean().optional()
});

export type GeneralPluginSettings = z.infer<typeof GeneralPluginSettingsSchema>;
