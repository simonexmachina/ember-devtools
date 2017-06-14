/* global devTools */
import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';
import config from "dummy/config/environment";

var app;

module('Acceptance: ember-devtools', {
  beforeEach() {
    app = startApp();
  },
  afterEach() {
    Ember.run(app, 'destroy');
  }
});

test('ownerNameFor() returns the name of something in the container', function(assert) {
  visit('/');
  andThen(function() {
    var route = devTools.route('foo');
    assert.equal(devTools.ownerNameFor(route), 'route:foo');
  });
});

test('route(name) returns named route', function(assert) {
  visit('/foo');
  andThen(function() {
    var route = devTools.route('foo');
    assert.ok(route instanceof Ember.Route);
  });
});

test('route() returns current route', function(assert) {
  visit('/foo');
  andThen(() => {
    var route = devTools.route();
    assert.ok(route === devTools.route('foo'));
  });
});

test('controller(name) returns named controller', function(assert) {
  visit('/foo');
  andThen(function() {
    var controller = devTools.controller('foo');
    assert.ok(controller instanceof Ember.Controller);
  });
});

test('controller() returns current controller', function(assert) {
  visit('/foo');
  andThen(() => {
    var controller = devTools.controller();
    assert.ok(controller === devTools.controller('foo'));
  });
});

test('model(name) returns model for named route', function(assert) {
  visit('/bar/baz');
  andThen(function() {
    assert.equal(devTools.model('bar'), 'bar');
  });
});

test('model() returns model for current route', function(assert) {
  visit('foo');
  andThen(() => {
    assert.equal(devTools.model(), 'foo');
  });
});

test('router() returns router', function(assert) {
  visit('/');
  andThen(function() {
    var router = devTools.router();
    assert.ok(router.hasRoute);
  });
});

test('routes() returns a list of route names', function(assert) {
  visit('/');
  andThen(function() {
    var routes = devTools.routes();
    assert.ok(~routes.indexOf('foo'));
    assert.ok(~routes.indexOf('bar'));
  });
});

// var componentType = 'test-component';
// test('component() returns a component for an element', function(assert) {
//  visit('/foo');
//  andThen(function() {
//    var $el = Ember.$(`.${componentType}`);
//    var view = devTools.component($el.get(0), componentType);
//    assert.ok(view instanceof Ember.Component);
//  });
// });
//
// test('component() returns a component for an element id', function(assert) {
//  visit('/foo');
//  andThen(function() {
//    var $el = Ember.$(`.${componentType}`);
//    var view = devTools.component($el.attr('id'), componentType);
//    assert.ok(view instanceof Ember.Component);
//  });
// });
//
test('config() returns application config', function(assert) {
 visit('/foo');
 andThen(function() {
   let env = devTools.config();
   assert.ok(env === config);
 });
});

test('currentRouteName() does what it says', function(assert) {
  visit('/bar/nested/quz');
  andThen(function() {
    assert.equal(devTools.currentRouteName(), 'nested.quz');
  });
});

test('currentPath() does what it says', function(assert) {
  visit('/bar/nested/quz');
  andThen(function() {
    assert.equal(devTools.currentPath(), 'bar.nested.quz');
  });
});

module('Acceptance: emberDevTools.global', {
  afterEach() {
    Ember.run(app, 'destroy');
  }
});

test('global: true', function(assert) {
  config['ember-devtools'] = {
    enabled: true,
    global: true
  };
  app = startApp();
  visit('/');
  andThen(function() {
    assert.ok(typeof window.routes === 'function');
  });
});

test('global: foo', function(assert) {
  config['ember-devtools'] = {
    enabled: true,
    global: 'foo'
  };
  app = startApp();
  visit('/');
  andThen(function() {
    assert.ok(typeof window.foo.routes === 'function');
  });
});


test('legacy emberDevTools.global: true', function(assert) {
  app = startApp({emberDevTools: {global: true}});
  visit('/');
  andThen(function() {
    assert.ok(typeof window.routes === 'function');
  });
});

test('legacy emberDevTools.global: foo', function(assert) {
  app = startApp({emberDevTools: {global: 'foo'}});
  visit('/');
  andThen(function() {
    assert.ok(typeof window.foo.routes === 'function');
  });
});

