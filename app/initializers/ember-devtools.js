/* global DS */
//import Devtools from '../services/ember-devtools';
import config from '../config/environment';

export default {
  name: 'ember-devtools',
  after: DS !== undefined ? 'store' : null,
  initialize(registry, app) {
    //app.register('service:devtools', Devtools, { singleton: true });
    app.inject('service:ember-devtools', 'store', 'service:store')
  }
};
