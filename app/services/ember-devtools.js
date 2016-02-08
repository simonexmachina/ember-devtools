/* global DS */
import Ember from 'ember';
var {
  $,
  Service
} = Ember;

export default Service.extend({
  container: null,
  renderedComponents: {},
  init() {
    this.global = this.global || window;
    this.console = this.console || window.console;
    if (typeof DS === 'object') {
      this.store = this.lookup('service:store') ||
          this.lookup('store:main'); // for ember-data < 2
      this.typeMaps = this.store.typeMaps;
    }
  },
  consoleLog() {
    this.console.log(...arguments);
  },
  app(name = 'main') {
    return this.lookup(`application:${name}`);
  },
  route(name) {
    name = name || this.currentRouteName();
    return this.lookup(`route:${name}`);
  },
  controller(name) {
    name = name || this.currentRouteName();
    return this.lookup(`controller:${name}`);
  },
  model(name) {
    var controller = this.controller(name);
    return controller && controller.get('model');
  },
  service(name) {
    return this.lookup(`service:${name}`);
  },
  router(name = 'main') {
    return this.lookup(`router:${name}`).get('router');
  },
  routes() {
    return Object.keys(this.router().recognizer.names);
  },
  component(idDomElementOrSelector, type) {
   if (typeof idDomElementOrSelector === 'object') {
     idDomElementOrSelector = idDomElementOrSelector.id;
   }
   return this.lookup(`component:${type}::${idDomElementOrSelector}`);
  },
  currentRouteName() {
    return this.controller('application').get('currentRouteName');
  },
  currentPath() {
    return this.controller('application').get('currentPath');
  },
  log(promise, property, getEach) {
    return promise.then((value) => {
      this.global.$E = value;
      if (property) {
        value = value[getEach ? 'getEach' : 'get'].call(value, property);
      }
      this.consoleLog(value);
    }, (err) => {
      this.console.error(err);
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
  logResolver(bool = true) {
    Ember.ENV.LOG_MODULE_RESOLVER = bool;
  },
  logAll(bool = true) {
    var app = this.app();
    app.LOG_ACTIVE_GENERATION = bool;
    app.LOG_VIEW_LOOKUPS = bool;
    app.LOG_TRANSITIONS = bool;
    app.LOG_TRANSITIONS_INTERNAL = bool;
    this.logResolver(bool);
  },
  logRenders() {
    var self = this;

    Ember.subscribe('render', {
      before(name, start, payload) {
        return start;
      },
      after(name, end, payload, start) {
        var id = payload.containerKey;
        if (!id) return;

        var duration = Math.round(end - start);
        var color = self.colorForRender(duration);
        var logId = `renderedComponents.${id}`;
        var ocurrences = self.get(logId);

        if (!ocurrences) {
          self.set(logId, []);
        }
        
        self.get(logId).push(duration);

        console.log('%c rendered ' + id + ' in ' + duration + 'ms', 'color: ' + color);
      }
    });
  },
  colorForRender(duration) {
    var ok = '#000000';
    var warning = '#F1B178';
    var serious = '#E86868';

    if (duration < 300) return ok;
    if (duration < 600) return warning;

    return serious;
  },
  environment() {
    return this.lookupFactory('config:environment');
  },
  globalize() {
    var props = ['app', 'container', 'store', 'typeMaps',
        'route', 'controller', 'model', 'service', 'routes', 'view', 'component', 
        'currentRouteName', 'currentPath', 'log', 'lookup', 'lookupFactory', 'containerNameFor',
        'inspect', 'logResolver', 'logAll'];
    // don't stomp on pre-existing global vars
    var skipGlobalize = this.constructor.skipGlobalize;
    if (skipGlobalize === null) {
      skipGlobalize = this.constructor.skipGlobalize = props.filter(prop => !Ember.isNone(this.global[prop]));
    }
    props.map((name) => {
      if (skipGlobalize.indexOf(name) !== -1) return;
      var prop = this[name];
      if (typeof prop === 'function') {
        prop = function() {
          return this[name].apply(this, arguments);
        };
      }
      this.global[name] = prop;
    });
  }
}).reopenClass({
  skipGlobalize: null
});
