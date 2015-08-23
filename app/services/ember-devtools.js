/* global DS */
import Ember from 'ember';
var {
  $,
  Service
} = Ember;

export default Service.extend({
  container: null,
  init() {
    this.global = this.global || window;
    this.console = this.console || window.console;
    if (typeof DS === 'object') {
      this.store = this.container.lookup('store:main');
      this.typeMaps = this.store.typeMaps;
    }
  },
  consoleLog() {
    this.console.log.apply(this.console, arguments);
  },
  app(name) {
    name = name || 'main';
    return this.container.lookup('application:' + name);
  },
  route(name) {
    name = name || this.currentRouteName();
    return this.container.lookup('route:' + name);
  },
  controller(name) {
    name = name || this.currentRouteName();
    return this.container.lookup('controller:' + name);
  },
  model(name) {
    var controller = this.controller(name);
    return controller && controller.get('model');
  },
  service(name) {
    return this.lookup('service:' + name);
  },
  router(name) {
    name = name || 'main';
    return this.container.lookup('router:' + name).get('router');
  },
  routes() {
    return Object.keys(this.router().recognizer.names);
  },
  //component(idDomElementOrSelector) {
  //  if (typeof idDomElementOrSelector === 'object') {
  //    idDomElementOrSelector = idDomElementOrSelector.id;
  //  }
  //  return Ember.Component.views[idDomElementOrSelector] || this.components(idDomElementOrSelector)[0];
  //},
  //components(selectorOrName) {
  //  var views = Ember.Component.views;
  //  var componentClass =  this.lookupFactory('component:' + selectorOrName);
  //
  //  if (componentClass) {
  //    return Object.keys(views).map(id => views[id])
  //      .filter(component => component instanceof componentClass);
  //  }
  //  else {
  //    return $(selectorOrName).map((ix, element) => views[element.id]);
  //  }
  //},
  currentRouteName() {
    return this.controller('application').get('currentRouteName');
  },
  currentPath() {
    return this.controller('application').get('currentPath');
  },
  log(promise, property, getEach) {
    var self = this;
    return promise.then(function(value) {
      self.global.$E = value;
      if (property) {
        value = value[getEach ? 'getEach' : 'get'].call(value, property);
      }
      self.consoleLog(value);
    }, function(err) {
      self.console.error(err);
    });
  },
  lookup(name) {
    return this.container.lookup(name);
  },
  lookupFactory(name) {
    return this.container.lookupFactory(name);
  },
  containerNameFor(object) {
    var cache = this.container.cache || this.container._defaultContainer.cache;
    var keys = Object.keys(cache);
    for (var i = 0; i < keys.length; i++) {
      if (cache[keys[i]] === object) return keys[i];
    }
  },
  inspect: Ember.inspect,
  logResolver(bool) {
    bool = typeof bool === 'undefined' ? true : bool;
    Ember.ENV.LOG_MODULE_RESOLVER = bool;
  },
  logAll(bool) {
    bool = typeof bool === 'undefined' ? true : bool;
    var app = this.app();
    app.LOG_ACTIVE_GENERATION = bool;
    app.LOG_VIEW_LOOKUPS = bool;
    app.LOG_TRANSITIONS = bool;
    app.LOG_TRANSITIONS_INTERNAL = bool;
    this.logResolver(bool);
  },
  globalize() {
    var self = this;
    var props = ['app', 'container', 'store', 'typeMaps',
        'route', 'controller', 'model', 'service', 'routes', 'view', 'currentRouteName',
        'currentPath', 'log', 'lookup', 'lookupFactory', 'containerNameFor',
        'inspect', 'logResolver', 'logAll'];
    // don't stomp on pre-existing global vars
    var skipGlobalize = this.constructor.skipGlobalize;
    if (skipGlobalize === null) {
      skipGlobalize = this.constructor.skipGlobalize = props.filter(function(prop) {
        return !Ember.isNone(self.global[prop]);
      });
    }
    props.map(function(name) {
      if (skipGlobalize.indexOf(name) !== -1) return;
      var prop = self[name];
      if (typeof prop === 'function') {
        prop = function() {
          return self[name].apply(self, arguments);
        };
      }
      self.global[name] = prop;
    });
  }
}).reopenClass({
  skipGlobalize: null
});
