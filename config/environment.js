/* jshint node:true */
var objectAssign = require('object-assign');

/**
 * Export the default config for ember-devtools. By default, enable only
 * in development.
 */
module.exports = function(environment, appConfig) {
  appConfig['ember-devtools'] = objectAssign({
    enabled: environment === 'development',
    global: false
  }, appConfig['ember-devtools'] || {});

  return {};
};
