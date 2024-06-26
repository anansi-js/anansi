import { SearchIndex } from 'algoliasearch';
import * as fs from 'fs';

type Settings = Awaited<ReturnType<SearchIndex['getSettings']>>;

export const buildAlgoliaConfig = () => {
  const config: Settings = {
    attributesToRetrieve: [
      'hierarchy.l0',
      'hierarchy.l1',
      'hierarchy.l2',
      'hierarchy.l3',
      'hierarchy.l4',
      'url',
      'content',
      'title',
      'originType'
    ],
    searchableAttributes: [
      'hierarchy.l0',
      'hierarchy.l1',
      'hierarchy.l2',
      'hierarchy.l3',
      'hierarchy.l4',
      'url',
      'content',
      'title'
    ],
    attributesForFaceting: ['filterOnly(originType)'],
    ranking: [
      'words',
      'filters',
      'typo',
      'attribute',
      'proximity',
      'exact',
      'custom'
    ],
    minWordSizefor1Typo: 3,
    minWordSizefor2Typos: 7,
    hitsPerPage: 20,
    maxValuesPerFacet: 100,
    minProximity: 1,
    customRanking: [
      'desc(weight.pageRank)',
      'desc(weight.level)',
      'asc(weight.position)'
    ]
  };
  return config;
};

export const parseAlgoliaConfig = (filePath: string) => {
  const configFile = fs.readFileSync(filePath);
  const config = JSON.parse(configFile.toString());
  return config;
};
