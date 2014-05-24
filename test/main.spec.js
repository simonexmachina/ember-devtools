emq.globalize();

var Model = Em.Object.extend();
var TestRoute = Ember.Route.extend({
  model: function() {
    return Model.create({
      name: this.routeName
    });
  }
});
var FooRouter = Ember.Router.extend({
  init: function() {}
});
FooRouter.reopen({
  router: FooRouter.create()
});
var FooView = Ember.View.extend({
  template: Ember.Handlebars.compile('Hello world')
});

var registry = {
  'route:foo': TestRoute.extend(),
  'route:bar': TestRoute.extend(),
  'controller:foo': Ember.Controller.extend(),
  'controller:bar': Ember.Controller.extend(),
  'router:foo': FooRouter.extend(),
  'view:foo': FooView,
  'view:bar': FooView,
};

var Resolver = Ember.DefaultResolver.extend({
  resolve: function(fullName) {
    return registry[fullName] || this._super.apply(this, arguments);
  }
});

setResolver(Resolver.create());

Ember.Router.map(function() {
  this.route('foo', {path: '/foosball'});
  this.resource('bar', function() {
    this.route('baz');
  });
});

var App;
module('ember-debug', {
  setup: function() {
    Ember.run(function() {
      App = Ember.Application.create({
        Resolver: Resolver
      });
      App.setupForTesting();
      App.injectTestHelpers();
    });
    Ember.run(function() {
      visit('/foosball');
    });
  },
  teardown: function() {
    App.reset();
  }
});

test('app() returns main App', function() {
  equal(App.debug.app(), App);
});

test('route(name) returns named route', function() {
  var route = App.debug.route('bar');
  ok(registry['route:bar'].detectInstance(route));
});

test('route() returns current route', function() {
  var route = App.debug.route();
  ok(registry['route:foo'].detectInstance(route));
});

test('controller(name) returns named controller', function() {
  var controller = App.debug.controller('bar');
  ok(registry['controller:bar'].detectInstance(controller));
});

test('controller() returns controller for current route', function() {
  var controller = App.debug.controller();
  ok(registry['controller:foo'].detectInstance(controller));
});

test('model(name) returns named model', function() {
  var model = App.debug.model('foo');
  equal(model.get('name'), 'foo');
});

test('model() returns model for current route', function() {
  visit('bar');
  var model = App.debug.model();
  equal(model.get('name'), 'bar');
});

test('router(name) returns named router', function() {
  var router = App.debug.router('foo');
  ok(FooRouter.detectInstance(router));
});

test('router() returns router for current route', function() {
  var router = App.debug.router();
  ok(typeof router == 'object');
});

test('routes() returns a list of route names', function() {
  var routes = App.debug.routes();
  ok(~routes.indexOf('foo'));
  ok(~routes.indexOf('bar'));
});

test('view() returns a view for an element', function() {
  visit('/bar');
  stop();
  andThen(function() {
    start();
    var $el = Em.$('.ember-view'),
        view = App.debug.view($el.get(0));
    ok(Ember.View.detectInstance(view));
  });
});

test('view() returns a view for an element id', function() {
  visit('/bar');
  stop();
  andThen(function() {
    start();
    var $el = Em.$('.ember-view'),
        view = App.debug.view($el.attr('id'));
    ok(Ember.View.detectInstance(view));
  });
});

test('currentRouteName() does what it says', function() {
  equal(App.debug.currentRouteName(), 'foo');
});

test('currentPath() does what it says', function() {
  visit('/bar/baz');
  stop();
  andThen(function() {
    start();
    equal(App.debug.currentRouteName(), 'bar.baz');
  });
});

test('log() resolves and logs the value', function() {
  var called = false;
  App.debug.consoleLog = function(value) {
    called = value;
  }
  var promise = Em.RSVP.resolve(true);
  stop();
  App.debug.log(promise).then(function() {
    start();
    equal(called, true);
  });
});

test('log() resolves and logs a property', function() {
  var called = false;
  App.debug.consoleLog = function(value) {
    called = value;
  }
  var promise = Em.RSVP.resolve(Em.Object.create({
    foo: 'bar'
  }));
  stop();
  App.debug.log(promise, 'foo').then(function() {
    start();
    equal(called, 'bar');
  });
});

test('log() resolves and logs using getEach()', function() {
  var called = false;
  App.debug.consoleLog = function(value) {
    called = value;
  }
  var promise = Em.RSVP.resolve([{
      foo: 'bar'
    }, {
      foo: 'baz'
    }
  ]);
  stop();
  App.debug.log(promise, 'foo', true).then(function() {
    start();
    equal(called[0], 'bar');
    equal(called[1], 'baz');
  });
});

test('className() returns a string name for an object', function() {
  ok(App.debug.className('App'), 'Ember.Application');
});

test('registry contains factories', function() {
  ok('router:main' in App.debug.registry);
});

test('lookup() returns instances', function() {
  ok(TestRoute.detectInstance(App.debug.lookup('route:foo')));
});

test('containerNameFor() returns the name of something in the container', function() {
  equal(App.debug.containerNameFor(App), 'application:main');
});

test('templates() returns the names of the defined templates', function() {
  Ember.TEMPLATES['foo'] = true;
  ok(App.debug.templates().indexOf('foo') !== -1);
});

test('inspect() is an alias to Ember.inspect', function() {
  ok(App.debug.inspect == Ember.inspect);
});

test('globalize() attaches stuff to the global scope', function() {
  App.debug.globalize();
  ok(app() == App);
});
