"use strict";

Ember.onLoad('Ember.Application', function(Application) {
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
        routes: function() {
          return Em.keys(app.Router.router.recognizer.names)
        },
        store: container.lookup("store:main"),
        typeMaps: container.lookup("store:main").typeMaps,
        templates: Em.keys(Ember.TEMPLATES),
        inspect: Em.inspect,
        observersFor: function(obj, property){
          Em.observersFor(obj, property);
        }
      };
    }
  });
});
