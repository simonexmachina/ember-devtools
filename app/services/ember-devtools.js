/* global DS */
import Ember from 'ember';

var map = Ember.ArrayPolyfills.map;
var $ = Ember.$;

export default Ember.Object.extend({
  init: function() {
    this.global = this.global || window;
    this.console = this.console || window.console;
    this.registry = this._registry();
    if (DS !== undefined) {
      this.store = this.container.lookup('store:main');
      this.typeMaps = this.store.typeMaps;
    }
  },
  consoleLog: function() {
    this.console.log.apply(this.console, arguments);
  },
  app: function(name) {
    name = name || 'main';
    return this.container.lookup('application:' + name);
  },
  route: function(name) {
    name = name || this.currentRouteName();
    return this.container.lookup('route:' + name);
  },
  controller: function(name) {
    name = name || this.currentRouteName();
    return this.container.lookup('controller:' + name);
  },
  model: function(name) {
    var controller = this.controller(name);
    return controller && controller.get('model');
  },
  service: function(name) {
    return this.lookup('service:' + name);
  },
  router: function(name) {
    name = name || 'main';
    return this.container.lookup('router:' + name).get('router');
  },
  routes: function() {
    return Ember.keys(this.router().recognizer.names);
  },
  view: function(idDomElementOrSelector) {
    if (typeof idDomElementOrSelector === 'object') {
      idDomElementOrSelector = idDomElementOrSelector.id;
    }
    return Ember.View.views[idDomElementOrSelector] || this.views(idDomElementOrSelector)[0];
  },
  views: function (selectorOrName) {
    var views = Ember.View.views;
    var viewClass =  this.lookupFactory('component:' + selectorOrName) || this.lookupFactory('view:' + selectorOrName);

    if (viewClass) {
      return Object.keys(views).map(function (id) {
        return views[id];
      }).filter(function (view) {
        return view instanceof viewClass;
      });
    }

    return map.call($(selectorOrName), function (element) {
      return views[element.id];
    });
  },
  component: function () {
    return this.view.apply(this, arguments);
  },
  components: function () {
    return this.views.apply(this, arguments);
  },
  currentRouteName: function() {
    return this.controller('application').get('currentRouteName');
  },
  currentPath: function() {
    return this.controller('application').get('currentPath');
  },
  log: function(promise, property, getEach) {
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
  lookup: function(name) {
    return this.container.lookup(name);
  },
  lookupFactory: function(name) {
    return this.container.lookupFactory(name);
  },
  containerNameFor: function(object) {
    var cache = this.container.cache || this.container._defaultContainer.cache;
    var keys = Object.keys(cache);
    for (var i = 0; i < keys.length; i++) {
      if (cache[keys[i]] === object) return keys[i];
    }
  },
  inspect: Ember.inspect,
  logResolver: function(bool) {
    bool = typeof bool === 'undefined' ? true : bool;
    Ember.ENV.LOG_MODULE_RESOLVER = bool;
  },
  logAll: function(bool) {
    bool = typeof bool === 'undefined' ? true : bool;
    var app = this.app();
    app.LOG_ACTIVE_GENERATION = bool;
    app.LOG_VIEW_LOOKUPS = bool;
    app.LOG_TRANSITIONS = bool;
    app.LOG_TRANSITIONS_INTERNAL = bool;
    this.logResolver(bool);
  },
  globalize: function() {
    var self = this;
    var props = ['app', 'container', 'registry', 'store', 'typeMaps',
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
  },
  _registry: function() {
    var registry;
    if (this.container._registry) {
      registry = this.container._registry.registrations;
    }
    return registry ||
      this.container.registrations ||
      this.container.registry.dict ||
      this.container.registry;
  }
}).reopenClass({
  skipGlobalize: null
});
