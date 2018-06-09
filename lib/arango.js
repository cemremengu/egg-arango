'use strict';

const assert = require('assert');
const arangojs = require('arangojs');

let count = 0;

module.exports = (app) => {
  app.addSingleton('arango', create);
};

function create(config, app) {
  assert(config.url, `[egg-arango] 'url: ${config.url}' is required on config`);
  console.log(config);

  app.coreLogger.info('[egg-arango] connecting %s', config.url);
  const db = new arangojs.Database({ url: config.url });
  db.useDatabase(config.database);
  db.useBasicAuth(config.username, config.password);

  app.beforeStart(function*() {
    const cursor = yield db.query({
      query: 'RETURN @value',
      bindVars: { value: Date.now() },
    });
    const result = yield cursor.next();
    const index = count++;
    app.coreLogger.info(
      `[egg-arango] instance[${index}] status OK, currentTime: ${new Date(result).toLocaleString()}`
    );
  });

  return db;
}
