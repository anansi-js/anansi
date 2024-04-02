/* eslint-disable @typescript-eslint/no-var-requires */
const NodeSpider = require('../../../dist');
require('dotenv').config();

const run = async () => {
  await NodeSpider.crawlSite({
    configFilePath: 'config.json',
    searchEngineOpts: {
      engine: 'custom',
      custom: {
        init: async () => {
          // do stuff
        },

        addRecords: async (records) => {
          console.log(records);
          // do stuff
        },

        finish: async () => {
          // do stuff
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
