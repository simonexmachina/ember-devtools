import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('foo');
  this.resource('bar', function() {
    this.route('baz');
    this.resource('nested', function() {
      this.route('quz');
    });
  });
});

export default Router;
