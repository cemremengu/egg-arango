'use strict';

const arango = require('./lib/arango');

module.exports = (app) => {
  if (app.config.arango.app) arango(app);
};
