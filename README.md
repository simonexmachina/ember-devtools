# ember-debug

A simple little initialiser that adds a `debug` object to your Ember.js app.

# Usage

    bower install ember-debug --save

When the code has been included in your app a `debug` object will be injected into your `Ember.Application` instance:

    console.log(MyApp.debug.routes)
    => ["todos.active", "todos.completed", "todos.index"]

# Functions

### `controller: function(name)`

Returns the named controller.

### `route: function(name)`

Returns the named route.

### `view: function(id)`

Return the View instance with the specified `id` e.g. `ember352`.

### `log: function(valueOrPromise)`

Logs the specified value, or waits until it's resolved if it's a `Promise`.

### `className: function(object)`

Returns the class name of the object.

### `registry`

Returns the injectable objects in the (poorly documented) container.

### `routes`

Returns the names of all routes.

### `store`

The Ember Data `Store`.

### `typeMaps`

The Ember Data 'type map'.

### `templates`

Returns the names of all templates.

### `inspect`

Does what it says, in a manner of speaking.

### `observersFor: function(obj, property)`

Returns the set of observers for the specified `property` on `obj`.
