import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import config from "dummy/config/environment";
import Devtools from 'dummy/services/ember-devtools';
import TestComponent from 'dummy/components/test-component';
import FooView from 'dummy/views/foo';

var app;

module('Acceptance: ember-devtools', {
  beforeEach: function() {
    app = startApp();
  },
  afterEach: function() {
    Ember.run(app, 'destroy');
  }
});

test('devTools is attached to the app', function(assert) {
  visit('/');
  andThen(function() {
    assert.ok(app.devTools instanceof Devtools);
  });
});

test('containerNameFor() returns the name of something in the container', function(assert) {
  visit('/');
  andThen(function() {
    var route = app.devTools.route('foo');
    assert.equal(app.devTools.containerNameFor(route), 'route:foo');
  });
});

test('route(name) returns named route', function(assert) {
  visit('/foo');
  andThen(function() {
    var route = app.devTools.route('foo');
    assert.ok(route instanceof Ember.Route);
  });
});

test('route() returns current route', function(assert) {
  visit('/foo');
  andThen(() => {
    var route = app.devTools.route();
    assert.ok(route === app.devTools.route('foo'));
  });
});

test('controller(name) returns named controller', function(assert) {
  visit('/foo');
  andThen(function() {
    var controller = app.devTools.controller('foo');
    assert.ok(controller instanceof Ember.Controller);
  });
});

test('controller() returns current controller', function(assert) {
  visit('/foo');
  andThen(() => {
    var controller = app.devTools.controller();
    assert.ok(controller === app.devTools.controller('foo'));
  });
});

test('model(name) returns model for named route', function(assert) {
  visit('/bar/baz');
  andThen(function() {
    assert.equal(app.devTools.model('bar'), 'bar');
  });
});

test('model() returns model for current route', function(assert) {
  visit('foo');
  andThen(() => {
    assert.equal(app.devTools.model(), 'foo');
  });
});

test('router() returns router', function(assert) {
  visit('/');
  andThen(function() {
    var router = app.devTools.router();
    assert.ok(router.hasRoute);
  });
});

test('routes() returns a list of route names', function(assert) {
  visit('/');
  andThen(function() {
    var routes = app.devTools.routes();
    assert.ok(~routes.indexOf('foo'));
    assert.ok(~routes.indexOf('bar'));
  });
});

test('view() returns a view for an element', function(assert) {
  visit('/foo');
  andThen(function() {
    var $el = Ember.$('.ember-view');
    var view = app.devTools.view($el.get(0));
    assert.ok(view instanceof Ember.View);
  });
});

test('view() returns a view for an element id', function(assert) {
  visit('/foo');
  andThen(function() {
    var $el = Ember.$('.ember-view');
    var view = app.devTools.view($el.attr('id'));
    assert.ok(view instanceof Ember.View);
  });
});

test('view() returns a view for a component-name', function(assert) {
  visit('/foo');
  andThen(function() {
    var view = app.devTools.view('test-component');
    assert.ok(view instanceof TestComponent);
  });
});

test('view() returns the first view that matches a selector', function(assert) {
  visit('/foo');
  andThen(function() {
    var view = app.devTools.view('.ember-view');
    assert.ok(view instanceof Ember.View);
  });
});

test('views() returns all views that match a view type', function(assert) {
  visit('/foo');
  andThen(function() {
    var views = app.devTools.views('foo');
    assert.equal(views.length, 1);
    assert.ok(views[0] instanceof FooView);
  });
});

test('views() returns all views that match a component type', function(assert) {
  visit('/foo');
  andThen(function() {
    var views = app.devTools.views('test-component');
    assert.equal(views.length, 2);
    assert.ok(views[0] instanceof TestComponent);
    assert.ok(views[1] instanceof TestComponent);
  });
});

test('views() returns all views that match a selector', function(assert) {
  visit('/foo');
  andThen(function() {
    var views = app.devTools.views('.test-component');
    assert.equal(views.length, 2);
    assert.ok(views[0] instanceof TestComponent);
    assert.ok(views[1] instanceof TestComponent);
  });
});

test('currentRouteName() does what it says', function(assert) {
  visit('/bar/nested/quz');
  andThen(function() {
    assert.equal(app.devTools.currentRouteName(), 'nested.quz');
  });
});

test('currentPath() does what it says', function(assert) {
  visit('/bar/nested/quz');
  andThen(function() {
    assert.equal(app.devTools.currentPath(), 'bar.nested.quz');
  });
});

module('Acceptance: emberDevTools.global', {
  afterEach: function() {
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

