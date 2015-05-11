import Ember from 'ember';
import startApp from '../helpers/start-app';
import Devtools from 'dummy/services/ember-devtools';
import TestComponent from 'dummy/components/test-component';
import FooView from 'dummy/views/foo';

var app;

module('Acceptance: ember-devtools', {
  setup: function() {
    app = startApp();
  },
  teardown: function() {
    Ember.run(app, 'destroy');
  }
});

test('devTools is attached to the app', function() {
  visit('/');
  andThen(function() {
    ok(app.devTools instanceof Devtools);
  });
});

test('containerNameFor() returns the name of something in the container', function() {
  visit('/');
  andThen(function() {
    var route = app.devTools.route('foo');
    equal(app.devTools.containerNameFor(route), 'route:foo');
  });
});

test('route(name) returns named route', function() {
  visit('/foo');
  andThen(function() {
    var route = app.devTools.route('foo');
    ok(route instanceof Ember.Route);
  });
});

test('route() returns current route', function() {
  visit('/foo');
  andThen(() => {
    var route = app.devTools.route();
    ok(route === app.devTools.route('foo'));
  });
});

test('controller(name) returns named controller', function() {
  visit('/foo');
  andThen(function() {
    var controller = app.devTools.controller('foo');
    ok(controller instanceof Ember.Controller);
  });
});

test('controller() returns current controller', function() {
  visit('/foo');
  andThen(() => {
    var controller = app.devTools.controller();
    ok(controller === app.devTools.controller('foo'));
  });
});

test('model(name) returns model for named route', function() {
  visit('/bar/baz');
  andThen(function() {
    equal(app.devTools.model('bar'), 'bar');
  });
});

test('model() returns model for current route', function() {
  visit('foo');
  andThen(() => {
    equal(app.devTools.model(), 'foo');
  });
});

test('router() returns router', function() {
  visit('/');
  andThen(function() {
    var router = app.devTools.router();
    ok(router.hasRoute);
  });
});

test('routes() returns a list of route names', function() {
  visit('/');
  andThen(function() {
    var routes = app.devTools.routes();
    ok(~routes.indexOf('foo'));
    ok(~routes.indexOf('bar'));
  });
});

test('view() returns a view for an element', function() {
  visit('/foo');
  andThen(function() {
    var $el = Ember.$('.ember-view');
    var view = app.devTools.view($el.get(0));
    ok(view instanceof Ember.View);
  });
});

test('view() returns a view for an element id', function() {
  visit('/foo');
  andThen(function() {
    var $el = Ember.$('.ember-view');
    var view = app.devTools.view($el.attr('id'));
    ok(view instanceof Ember.View);
  });
});

test('view() returns a view for a component-name', function() {
  visit('/foo');
  andThen(function() {
    var view = app.devTools.view('test-component');
    ok(view instanceof TestComponent);
  });
});

test('view() returns the first view that matches a selector', function() {
  visit('/foo');
  andThen(function() {
    var view = app.devTools.view('.ember-view');
    ok(view instanceof Ember.View);
  });
});

test('views() returns all views that match a view type', function() {
  visit('/foo');
  andThen(function() {
    var views = app.devTools.views('foo');
    equal(views.length, 1);
    ok(views[0] instanceof FooView);
  });
});

test('views() returns all views that match a component type', function() {
  visit('/foo');
  andThen(function() {
    var views = app.devTools.views('test-component');
    equal(views.length, 2);
    ok(views[0] instanceof TestComponent);
    ok(views[1] instanceof TestComponent);
  });
});

test('views() returns all views that match a selector', function() {
  visit('/foo');
  andThen(function() {
    var views = app.devTools.views('.test-component');
    equal(views.length, 2);
    ok(views[0] instanceof TestComponent);
    ok(views[1] instanceof TestComponent);
  });
});

test('currentRouteName() does what it says', function() {
  visit('/bar/nested/quz');
  andThen(function() {
    equal(app.devTools.currentRouteName(), 'nested.quz');
  });
});

test('currentPath() does what it says', function() {
  visit('/bar/nested/quz');
  andThen(function() {
    equal(app.devTools.currentPath(), 'bar.nested.quz');
  });
});

module('Acceptance: emberDevTools.global', {
  setup: function() {},
  teardown: function() {
    Ember.run(app, 'destroy');
  }
});

test('emberDevTools.global: true', function() {
  app = startApp({emberDevTools: {global: true}});
  visit('/');
  andThen(function() {
    ok(typeof window.routes === 'function');
  });
});

test('emberDevTools.global: foo', function() {
  app = startApp({emberDevTools: {global: 'foo'}});
  visit('/');
  andThen(function() {
    ok(typeof window.foo.routes === 'function');
  });
});

