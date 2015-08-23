export default {
  name: 'ember-devtools',
  after: typeof window.DS === 'object' ? 'ember-data' : null,
  initialize() {}
};


