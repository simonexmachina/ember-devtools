/* global DS */
import Devtools from '../services/ember-devtools';
import config from '../config/environment';

export default {
  name: 'ember-devtools',
  initialize(instance) {
    const devToolsConfig = config['ember-devtools'] || {};

    let devTools = instance.container.lookup('service:ember-devtools');

    if (devToolsConfig.global === true) {
      devTools.globalize();
    }
    else if (devToolsConfig.global) {
      window[devToolsConfig.global] = devTools;
    }
  }
};
