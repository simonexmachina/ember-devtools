import Ember from 'ember';
import Devtools from '../services/ember-devtools';

export default {
  name: 'ember-devtools',
  after: DS !== undefined ? 'store' : null,
  initialize: function(container, app) {
    app.devTools = Devtools.create({
      container: container
    });
    container.register('service:devtools', app.devTools);
  }
}
