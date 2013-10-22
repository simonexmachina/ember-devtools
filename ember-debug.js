Ember.onLoad('Ember.Application', function(Application) {
  "use strict";
  return Application.initializer({
    name: 'debug',
    initialize: function(container, app) {
      app.debug = {
        controller: function(name){
          return container.lookup("controller:" + name);
        },
        route: function(name){
          return container.lookup("route:" + name);
        },
        view: function(domElem){
          return Em.View.views[domElem];
        },
        log: function(valueOrPromise) {
          if( valueOrPromise.then ) {
            valueOrPromise.then(function(value) {
              console.log(value);
            });
          }
          else {
            console.log(valueOrPromise);
          }
        },
        className: function(object) {
          return object.__proto__.constructor;
        },
        registry: container.registry.dict,
        lookup: function(name) {
          return container.lookup(name);
        },
        router: function(name) {
          name = name || "main";
          return container.lookup("router:" + name).get('router');
        },
        routes: function() {
          return Em.keys(this.router().recognizer.names)
        },
        templates: Em.keys(Ember.TEMPLATES),
        inspect: Em.inspect,
        observersFor: function(obj, property){
          Em.observersFor(obj, property);
        },
        logResolver: function(bool) {
          bool = typeof bool == 'undefined' ? true : bool;
          Em.ENV.LOG_MODULE_RESOLVER = bool;
        },
        logAll: function(bool) {
          bool = typeof bool == 'undefined' ? true : bool;
          app.LOG_ACTIVE_GENERATION = bool;
          app.LOG_VIEW_LOOKUPS = bool;
          app.LOG_TRANSITIONS = bool;
          app.LOG_TRANSITIONS_INTERNAL = bool;
        },
        globalize: function() {
          for( var prop in this ) {
            if( this.hasOwnProperty(prop) ) {
              window[prop] = window[prop] || this[prop];
            }
          }
        }
      };
      if( DS ) {
        app.debug.store = container.lookup("store:main");
        app.debug.typeMaps = container.lookup("store:main").typeMaps;
      }
    }
  });
});
