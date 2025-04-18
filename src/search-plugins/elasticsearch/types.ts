import { z } from 'zod';

export const ElasticsearchPluginOptionsSchema = z.object({
  /** Elasticsearch node URL */
  node: z.string(),
  /** Elasticsearch index name */
  indexName: z.string(),
  /** Optional: Elasticsearch username */
  username: z.string().optional(),
  /** Optional: Elasticsearch password */
  password: z.string().optional(),
  /** Optional: Elasticsearch API key */
  apiKey: z.string().optional(),
  /** Optional: Custom mapping for the index */
  mapping: z.record(z.any()).optional(),
  /** Optional: Custom settings for the index */
  settings: z.record(z.any()).optional()
});

export type ElasticsearchPluginOptions = z.infer<
  typeof ElasticsearchPluginOptionsSchema
>;
