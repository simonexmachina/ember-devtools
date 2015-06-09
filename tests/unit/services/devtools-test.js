import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('service:ember-devtools', 'DevtoolsService', {
}, function(container, context, defaultSubject) {
  container.register('store:main', DS.Store);
});

test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});

test('log() resolves and logs the value', function(assert) {
  assert.expect(1);
  var called = false;
  var devTools = this.subject({
    consoleLog: function(value) {
      called = value;
    }
  });
  var promise = Ember.RSVP.resolve(true);
  devTools.log(promise).then(function() {
    assert.equal(called, true);
  });
});

test('log() resolves and logs a property', function(assert) {
  assert.expect(1);
  var called = false;
  var devTools = this.subject({
    consoleLog: function(value) {
      called = value;
    }
  });
  var promise = Ember.RSVP.resolve(Ember.Object.create({
    foo: 'bar'
  }));
  devTools.log(promise, 'foo').then(function() {
    assert.equal(called, 'bar');
  });
});

test('log() resolves and logs using getEach()', function(assert) {
  assert.expect(2);
  var called = false;
  var devTools = this.subject({
    consoleLog: function(value) {
      called = value;
    }
  });
  var promise = Ember.RSVP.resolve(Ember.A([{
    foo: 'bar'
  }, {
    foo: 'baz'
  }
  ]));
  devTools.log(promise, 'foo', true).then(function() {
    assert.equal(called[0], 'bar');
    assert.equal(called[1], 'baz');
  });
});

test('registry contains factories', function(assert) {
  assert.ok('store:main' in this.subject().registry);
});

test('lookup() returns instances', function(assert) {
  assert.ok(this.subject().lookup('store:main') instanceof DS.Store);
});

test('inspect() is an alias to Ember.inspect', function(assert) {
  assert.ok(this.subject().inspect === Ember.inspect);
});

test('globalize() attaches stuff to the global scope', function(assert) {
  var global = {};
  var devTools = this.subject({
    global: global
  });
  devTools.globalize();
  assert.ok(global.container === this.subject().container);
});

test('globalize() doesn\'t stomp on pre-existing global vars', function(assert) {
  var global = {container: 'foo'};
  var devTools = this.subject({
    global: global
  });
  devTools.globalize();
  assert.ok(global.container !== this.subject().container);
});
