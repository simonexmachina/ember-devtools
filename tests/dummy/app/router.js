import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('foo');
  this.route('bar', {resetNamespace: true}, function() {
    this.route('baz');
    this.route('nested', {resetNamespace: true}, function() {
      this.route('quz');
    });
  });
});

export default Router;
