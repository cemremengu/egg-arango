'use strict';

const assert = require('assert');
const arangojs = require('arangojs');

let count = 0;

module.exports = (app) => {
  app.addSingleton('arango', create);
};

function create(config, app) {
  assert(config.url, `[egg-arango] 'url: ${config.url}' are required on config`);

  app.coreLogger.info('[egg-arango] connecting %s', config.url);
  const client = new arangojs.Database(config);

  app.beforeStart(function*() {
    const cursor = yield client.query({
      query: 'RETURN @value',
      bindVars: { value: Date.now() },
    });
    const result = yield cursor.next();
    const index = count++;
    app.coreLogger.info(`[egg-arango] instance[${index}] status OK, currentTime: ${result}`);
  });

  return client;
}
