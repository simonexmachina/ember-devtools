import config from '../config/environment';

export default {
  initialize(appInstance) {
    var service = 'service:ember-devtools';
    var devTools = appInstance.lookup ? appInstance.lookup(service)
        // backwards compatibility < 2.1
        : appInstance.container.lookup(service);
    var devToolsConfig = config['ember-devtools'] || {};
    if (devToolsConfig.global === true) {
      devTools.globalize();
    }
    else if (devToolsConfig.global) {
      window[devToolsConfig.global] = devTools;
    }
  }
};
