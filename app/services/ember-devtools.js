/* global DS */
import Ember from 'ember';

const map = Ember.ArrayPolyfills.map,
  $ = Ember.$;

export default Ember.Service.extend({
  init() {
    this.global = this.global || window;
    this.console = this.console || window.console;
    this.registry = this._registry();
    if (DS !== undefined) {
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
    return Ember.keys(this.router().recognizer.names);
  },
  view(idDomElementOrSelector) {
    if (typeof idDomElementOrSelector === 'object') {
      idDomElementOrSelector = idDomElementOrSelector.id;
    }
    return Ember.View.views[idDomElementOrSelector] || this.views(idDomElementOrSelector)[0];
  },
  views(selectorOrName) {
    const views = Ember.View.views,
      viewClass =  this.lookupFactory('component:' + selectorOrName) || this.lookupFactory('view:' + selectorOrName);

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
  component() {
    return this.view.apply(this, arguments);
  },
  components() {
    return this.views.apply(this, arguments);
  },
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
    const cache = this.container.cache || this.container._defaultContainer.cache,
      keys = Object.keys(cache);
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
    const app = this.app();
    app.LOG_ACTIVE_GENERATION = bool;
    app.LOG_VIEW_LOOKUPS = bool;
    app.LOG_TRANSITIONS = bool;
    app.LOG_TRANSITIONS_INTERNAL = bool;
    this.logResolver(bool);
  },
  globalize() {
    var self = this;
    const props = ['app', 'container', 'registry', 'store', 'typeMaps',
        'route', 'controller', 'model', 'service', 'routes', 'view', 'currentRouteName',
        'currentPath', 'log', 'lookup', 'lookupFactory', 'containerNameFor',
        'inspect', 'logResolver', 'logAll'];
    // don't stomp on pre-existing global vars
    let skipGlobalize = this.constructor.skipGlobalize;
    if (skipGlobalize === null) {
      skipGlobalize = this.constructor.skipGlobalize = props.filter(function(prop) {
        return !Ember.isNone(self.global[prop]);
      });
    }
    props.map(function(name) {
      if (skipGlobalize.indexOf(name) !== -1) return;
      let prop = self[name];
      if (typeof prop === 'function') {
        prop = function() {
          return self[name].apply(self, arguments);
        };
      }
      self.global[name] = prop;
    });
  },
  _registry() {
    let registry;
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
