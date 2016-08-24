/* global window */
import config from '../config/environment';

export default {
  initialize(appInstance) {
    var devToolsConfig = config['ember-devtools'] || {};
    let enabled = devToolsConfig.enabled;
    if (enabled === undefined) {
      enabled = /(development|test)/.test(config.environment);
    }
    if (!enabled) return;
    var service = 'service:ember-devtools';
    var devTools = appInstance.lookup ? appInstance.lookup(service)
        // backwards compatibility < 2.1
        : appInstance.container.lookup(service);
    if (devToolsConfig.global === true) {
      devTools.globalize();
    }
    else if (devToolsConfig.global) {
      window[devToolsConfig.global] = devTools;
    }
  }
};
