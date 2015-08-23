import config from '../config/environment';

export default {
  initialize(app) {
    var devTools = app.container.lookup('service:ember-devtools');
    var devToolsConfig = config['ember-devtools'] || {};
    if (devToolsConfig.global === true) {
      devTools.globalize();
    }
    else if (devToolsConfig.global) {
      window[devToolsConfig.global] = devTools;
    }
  }
};
