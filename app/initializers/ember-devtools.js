/* global DS */
import Devtools from '../services/ember-devtools';

export default {
  name: 'ember-devtools',
  after: DS !== undefined ? 'store' : null,
  initialize: function(container, app) {
    app.devTools = Devtools.create({
      container: container
    });
    container.register('service:devtools', app.devTools);
    var config = app.emberDevTools || {};
    if (config.global === true) {
      app.devTools.globalize();
    }
    else if (config.global) {
      window[config.global] = app.devTools;
    }
  }
};
