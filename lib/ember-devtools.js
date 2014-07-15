/* global Ember */
Ember.Application.initializer({
  name: 'debug',
  after: typeof DS !== 'undefined' ? 'store' : null,
  initialize: function(container, app) {
    function alias(name) {
      return function() {
        debug[name].apply(null, arguments);
      };
    }
    var debug = app.debug = {
      container: container,
      console: window.console,
      consoleLog: window.console.log,
      app: function(name) {
        name = name || 'main';
        return container.lookup('application:' + name);
      },
      route: function(name) {
        name = name || debug.currentRouteName();
        return container.lookup('route:' + name);
      },
      controller: function(name) {
        name = name || debug.currentRouteName();
        return container.lookup('controller:' + name);
      },
      model: function(name) {
        var controller = debug.controller(name);
        return controller && controller.get('model');
      },
      router: function(name) {
        name = name || 'main';
        return container.lookup('router:' + name).get('router');
      },
      routes: function() {
        return Ember.keys(debug.router().recognizer.names);
      },
      view: function(id) {
        if (typeof id === 'object') {
          id = id.id;
        }
        return Ember.View.views[id];
      },
      currentRouteName: function() {
        return debug.controller('application').get('currentRouteName');
      },
      currentPath: function() {
        return debug.controller('application').get('currentPath');
      },
      log: function(promise, property, getEach) {
        return promise.then(function(value) {
          window.$E = value;
          if (property) {
            value = value[getEach ? 'getEach' : 'get'].call(value, property);
          }
          debug.consoleLog.call(debug.console, value);
        });
      },
      className: function(object) {
        return object.__proto__.constructor;
      },
      registry: container.registry.dict,
      lookup: function(name) {
        return container.lookup(name);
      },
      lookupFactory: function(name) {
        return container.lookupFactory(name);
      },
      containerNameFor: function(object) {
        var name;
        container.cache.eachLocal(function(key, value) {
          if (value === object) {
            name = key;
          }
        });
        return name;
      },
      templates: function() {
        return Ember.keys(Ember.TEMPLATES);
      },
      inspect: Ember.inspect,
      logResolver: function(bool) {
        bool = typeof bool === 'undefined' ? true : bool;
        Ember.ENV.LOG_MODULE_RESOLVER = bool;
      },
      logAll: function(bool) {
        bool = typeof bool === 'undefined' ? true : bool;
        app.LOG_ACTIVE_GENERATION = bool;
        app.LOG_VIEW_LOOKUPS = bool;
        app.LOG_TRANSITIONS = bool;
        app.LOG_TRANSITIONS_INTERNAL = bool;
        logResolver(bool);
      },
      globalize: function() {
        for (var prop in this) {
          if (this.hasOwnProperty(prop)) {
            window[prop] = window[prop] || this[prop];
          }
        }
      }
    };
    if (typeof DS !== 'undefined') {
      debug.store = container.lookup('store:main');
      debug.typeMaps = debug.store.typeMaps;
    }
  }
});
