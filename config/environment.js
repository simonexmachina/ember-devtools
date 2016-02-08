/* jshint node:true */

/**
 * Export the default config for ember-devtools. By default, enable only
 * in development.
 */
module.exports = function(environment, appConfig) {
  appConfig['ember-devtools'] = Object.assign({
    enabled: environment === 'development',
    global: false
  }, appConfig['ember-devtools'] || {});

  return {};
};
