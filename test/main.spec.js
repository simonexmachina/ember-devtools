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
module('ember-devtools', {
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
  equal(App.devTools.app(), App);
});

test('route(name) returns named route', function() {
  var route = App.devTools.route('bar');
  ok(registry['route:bar'].detectInstance(route));
});

test('route() returns current route', function() {
  var route = App.devTools.route();
  ok(registry['route:foo'].detectInstance(route));
});

test('controller(name) returns named controller', function() {
  var controller = App.devTools.controller('bar');
  ok(registry['controller:bar'].detectInstance(controller));
});

test('controller() returns controller for current route', function() {
  var controller = App.devTools.controller();
  ok(registry['controller:foo'].detectInstance(controller));
});

test('model(name) returns named model', function() {
  var model = App.devTools.model('foo');
  equal(model.get('name'), 'foo');
});

test('model() returns model for current route', function() {
  visit('bar');
  var model = App.devTools.model();
  equal(model.get('name'), 'bar');
});

test('router(name) returns named router', function() {
  var router = App.devTools.router('foo');
  ok(FooRouter.detectInstance(router));
});

test('router() returns router for current route', function() {
  var router = App.devTools.router();
  ok(typeof router == 'object');
});

test('routes() returns a list of route names', function() {
  var routes = App.devTools.routes();
  ok(~routes.indexOf('foo'));
  ok(~routes.indexOf('bar'));
});

test('view() returns a view for an element', function() {
  visit('/bar');
  stop();
  andThen(function() {
    start();
    var $el = Em.$('.ember-view'),
        view = App.devTools.view($el.get(0));
    ok(Ember.View.detectInstance(view));
  });
});

test('view() returns a view for an element id', function() {
  visit('/bar');
  stop();
  andThen(function() {
    start();
    var $el = Em.$('.ember-view'),
        view = App.devTools.view($el.attr('id'));
    ok(Ember.View.detectInstance(view));
  });
});

test('currentRouteName() does what it says', function() {
  equal(App.devTools.currentRouteName(), 'foo');
});

test('currentPath() does what it says', function() {
  visit('/bar/baz');
  stop();
  andThen(function() {
    start();
    equal(App.devTools.currentRouteName(), 'bar.baz');
  });
});

test('log() resolves and logs the value', function() {
  var called = false;
  App.devTools.consoleLog = function(value) {
    called = value;
  }
  var promise = Em.RSVP.resolve(true);
  stop();
  App.devTools.log(promise).then(function() {
    start();
    equal(called, true);
  });
});

test('log() resolves and logs a property', function() {
  var called = false;
  App.devTools.consoleLog = function(value) {
    called = value;
  }
  var promise = Em.RSVP.resolve(Em.Object.create({
    foo: 'bar'
  }));
  stop();
  App.devTools.log(promise, 'foo').then(function() {
    start();
    equal(called, 'bar');
  });
});

test('log() resolves and logs using getEach()', function() {
  var called = false;
  App.devTools.consoleLog = function(value) {
    called = value;
  }
  var promise = Em.RSVP.resolve([{
      foo: 'bar'
    }, {
      foo: 'baz'
    }
  ]);
  stop();
  App.devTools.log(promise, 'foo', true).then(function() {
    start();
    equal(called[0], 'bar');
    equal(called[1], 'baz');
  });
});

test('className() returns a string name for an object', function() {
  ok(App.devTools.className('App'), 'Ember.Application');
});

test('registry contains factories', function() {
  ok('router:main' in App.devTools.registry);
});

test('lookup() returns instances', function() {
  ok(TestRoute.detectInstance(App.devTools.lookup('route:foo')));
});

test('containerNameFor() returns the name of something in the container', function() {
  equal(App.devTools.containerNameFor(App), 'application:main');
});

test('templates() returns the names of the defined templates', function() {
  Ember.TEMPLATES['foo'] = true;
  ok(App.devTools.templates().indexOf('foo') !== -1);
});

test('inspect() is an alias to Ember.inspect', function() {
  ok(App.devTools.inspect == Ember.inspect);
});

test('globalize() attaches stuff to the global scope', function() {
  App.devTools.globalize();
  ok(app() == App);
});
