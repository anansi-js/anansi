/* eslint-disable @typescript-eslint/no-var-requires */
const NodeSpider = require('../../../dist');
require('dotenv').config();

const run = async () => {
  await NodeSpider.crawlSite({
    configFilePath: 'config.json',
    searchEngineOpts: {
      engine: 'custom',
      custom: {
        endpoints: {
          init: {
            url: 'https://my-search-api.com/init',
            method: 'GET',
            headers: {
              'x-api-key': 'my-api-key'
            }
          },
          addRecords: {
            url: 'https://my-search-api.com/add-records',
            method: 'POST',
            getBody: (newRecords) => newRecords,
            headers: {
              'x-api-key': 'my-api-key'
            }
          },
          finish: {
            url: 'https://my-search-api.com/finish',
            method: 'GET',
            headers: {
              'x-api-key': 'my-api-key'
            }
          }
        }
      }
    }
  });
};

run()
  .then(() => {
    console.log('done');
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
