'use strict';

const arango = require('./lib/arango');

module.exports = (agent) => {
  if (agent.config.arango.agent) arango(agent);
};
