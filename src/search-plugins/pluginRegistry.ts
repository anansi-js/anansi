import { SearchPlugin } from './interfaces';
import { SearchPluginOptions } from './types';
import { GeneralPluginSettingsSchema } from './generalPluginSettings';
import { AlgoliaPluginOptionsSchema } from './algolia/types';
import { PineconePluginOptionsSchema } from './pinecone/types';
import { ElasticsearchPluginOptionsSchema } from './elasticsearch/types';

export const getPlugin = async (
  options?: SearchPluginOptions
): Promise<SearchPlugin> => {
  const isGeneralSettingsValid = GeneralPluginSettingsSchema.safeParse(
    options?.generalSettings
  );
  if (!isGeneralSettingsValid.success) {
    throw new Error('generalSettings is invalid');
  }

  switch (options?.engine) {
    case 'algolia': {
      const algoliaPluginOptions = AlgoliaPluginOptionsSchema.parse(
        options?.algolia
      );
      const { AlgoliaPlugin } = await import('./algolia/AlgoliaPlugin');
      const plugin = new AlgoliaPlugin({
        ...algoliaPluginOptions,
        ...options.generalSettings
      });
      return plugin;
    }
    case 'test': {
      const { DummyFsPlugin } = await import('./dummy-fs-plugin/DummyFsPlugin');
      return new DummyFsPlugin();
    }
    case 'custom': {
      const { CustomPlugin } = await import('./custom/CustomPlugin');
      return new CustomPlugin({
        ...options.custom,
        ...options.generalSettings
      });
    }
    case 'pinecone': {
      const pineconePluginOptions = PineconePluginOptionsSchema.parse(
        options?.pinecone
      );
      const { PineconePlugin } = await import('./pinecone/PineconePlugin');
      return new PineconePlugin({
        ...pineconePluginOptions,
        ...options.generalSettings
      });
    }
    case 'elasticsearch': {
      const elasticsearchPluginOptions = ElasticsearchPluginOptionsSchema.parse(
        options?.elasticsearch
      );
      const { ElasticsearchPlugin } = await import(
        './elasticsearch/ElasticsearchPlugin'
      );
      return new ElasticsearchPlugin({
        ...elasticsearchPluginOptions,
        ...options.generalSettings
      });
    }
    default: {
      throw new Error('unknown plugin type');
    }
  }
};
