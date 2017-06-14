import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
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
