/* global Ember */
Ember.Application.initializer({
  name: 'ember-devtools',
  after: typeof DS !== 'undefined' ? 'store' : null,
  initialize: function(container, app) {
    app.devTools = create(container, app);
    container.register('dev-tools:' + app.get('name') || main, app.devTools);
  }
});

function create(container, app) {
  var devTools = {
    container: container,
    console: window.console,
    consoleLog: function() {
      devTools.console.log.apply(devTools.console, arguments);
    },
    app: function(name) {
      name = name || 'main';
      return container.lookup('application:' + name);
    },
    route: function(name) {
      name = name || devTools.currentRouteName();
      return container.lookup('route:' + name);
    },
    controller: function(name) {
      name = name || devTools.currentRouteName();
      return container.lookup('controller:' + name);
    },
    model: function(name) {
      var controller = devTools.controller(name);
      return controller && controller.get('model');
    },
    service: function(name) {
      return devTools.lookup('service:' + name);
    },
    router: function(name) {
      name = name || 'main';
      return container.lookup('router:' + name).get('router');
    },
    routes: function() {
      return Ember.keys(devTools.router().recognizer.names);
    },
    view: function(id) {
      if (typeof id === 'object') {
        id = id.id;
      }
      return Ember.View.views[id];
    },
    currentRouteName: function() {
      return devTools.controller('application').get('currentRouteName');
    },
    currentPath: function() {
      return devTools.controller('application').get('currentPath');
    },
    log: function(promise, property, getEach) {
      return promise.then(function(value) {
        window.$E = value;
        if (property) {
          value = value[getEach ? 'getEach' : 'get'].call(value, property);
        }
        devTools.consoleLog(value);
      }, function(err) {
        devTools.console.error(err);
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
        if (this.hasOwnProperty(prop) && !window[prop]) {
          window[prop] = this[prop];
        }
      }
    }
  };
  if (typeof DS !== 'undefined') {
    devTools.store = container.lookup('store:main');
    devTools.typeMaps = devTools.store.typeMaps;
  }
  return devTools;
}
