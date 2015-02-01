import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('service:ember-devtools', 'DevtoolsService', {
}, function(container, context, defaultSubject) {
  container.register('store:main', DS.Store);
});

test('it exists', function() {
  var service = this.subject();
  ok(service);
});

test('log() resolves and logs the value', function() {
  var called = false;
  var devTools = this.subject();
  devTools.consoleLog = function(value) {
    called = value;
  };
  var promise = Ember.RSVP.resolve(true);
  stop();
  devTools.log(promise).then(function() {
    equal(called, true);
    start();
  });
});

test('log() resolves and logs a property', function() {
  var called = false;
  var devTools = this.subject();
  devTools.consoleLog = function(value) {
    called = value;
  };
  var promise = Ember.RSVP.resolve(Ember.Object.create({
    foo: 'bar'
  }));
  stop();
  devTools.log(promise, 'foo').then(function() {
    equal(called, 'bar');
    start();
  });
});

test('log() resolves and logs using getEach()', function() {
  var called = false;
  var devTools = this.subject();
  devTools.consoleLog = function(value) {
    called = value;
  };
  var promise = Ember.RSVP.resolve([{
    foo: 'bar'
  }, {
    foo: 'baz'
  }
  ]);
  stop();
  devTools.log(promise, 'foo', true).then(function() {
    equal(called[0], 'bar');
    equal(called[1], 'baz');
    start();
  });
});

test('registry contains factories', function() {
  ok('store:main' in this.subject().registry);
});

test('lookup() returns instances', function() {
  ok(this.subject().lookup('store:main') instanceof DS.Store);
});

test('templates() returns the names of the defined templates', function() {
  Ember.TEMPLATES['foo'] = true;
  ok(~this.subject().templates().indexOf('foo'));
});

test('inspect() is an alias to Ember.inspect', function() {
  ok(this.subject().inspect === Ember.inspect);
});

test('globalize() attaches stuff to the global scope', function() {
  this.subject().globalize();
  ok(window.container === this.subject().container);
});
