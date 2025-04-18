import { z } from 'zod';

export const PineconePluginOptionsSchema = z.object({
  /** Pinecone API key */
  apiKey: z.string(),
  /** Pinecone index name */
  indexName: z.string(),
  /** Pinecone embedding parameters */
  embed: z.object({
    model: z.string(),
    fieldMap: z.record(z.string(), z.string()),
    metric: z.string(),
    readParameters: z.record(z.string(), z.any()),
    writeParameters: z.record(z.string(), z.any())
  }),
  /** Pinecone cloud */
  cloud: z.string(),
  /** Pinecone region */
  region: z.string()
});

export type PineconePluginOptions = z.infer<typeof PineconePluginOptionsSchema>;

export const PineconeRecordSchema = z.object({
  id: z.string(),
  values: z.array(z.number()),
  metadata: z.record(z.any())
});

export type PineconeRecord = z.infer<typeof PineconeRecordSchema>;
