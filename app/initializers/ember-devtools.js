/* global DS */
import Devtools from '../services/ember-devtools';
import config from '../config/environment';

export default {
  name: 'ember-devtools',
  after: DS !== undefined ? 'store' : null,
  initialize(container, app) {
    Ember.deprecate("ember-devtools: 'config.APP.emberDevTools' is deprecated. Please configure ember-devtools using config['ember-devtools'].",
      !app.emberDevTools,
      { url: 'https://github.com/aexmachina/ember-devtools' });

    const devToolsConfig = app.emberDevTools || config['ember-devtools'] || {};

    app.devTools = Devtools.create({
      container: container
    });
    container.register('service:devtools', app.devTools);
    if (devToolsConfig.global === true) {
      app.devTools.globalize();
    }
    else if (devToolsConfig.global) {
      window[devToolsConfig.global] = app.devTools;
    }
  }
};
