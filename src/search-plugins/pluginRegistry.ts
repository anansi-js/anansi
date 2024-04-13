import { AlgoliaPlugin } from './algolia/AlgoliaPlugin';
import { CustomPlugin } from './custom/CustomPlugin';
import { DummyFsPlugin } from './dummy-fs-plugin/DummyFsPlugin';
import { SearchPlugin } from './interfaces';
import { SearchPluginOptions } from './types';

export const getPlugin = (options?: SearchPluginOptions): SearchPlugin => {
  switch (options?.engine) {
    case 'algolia': {
      const plugin = new AlgoliaPlugin({
        ...options.algolia,
        ...options.generalSettings
      });
      return plugin;
    }
    case 'test': {
      return new DummyFsPlugin();
    }
    case 'custom': {
      return new CustomPlugin({
        ...options.custom,
        ...options.generalSettings
      });
    }
    default: {
      throw new Error('unknown plugin type');
    }
  }
};
