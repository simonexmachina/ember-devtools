# ember-debug

A simple little initialiser that adds a `debug` object to your Ember.js app.

# Usage

    bower install ember-debug --save

When the code has been included in your app a `debug` object will be injected into your `Ember.Application` instance:

    console.log(MyApp.debug.routes)
    => ["todos.active", "todos.completed", "todos.index"]

# Functions

### `controller: function(name)`

Returns the named controller. Defaults to the controller for the current route.

### `model: function(name)`

Returns the model for the named controller. Defaults to the controller for the current route.

### `route: function(name)`

Returns the named route. Defaults to the current route.

### `router: function(name)`

Returns the named router instance. Defaults to `router:main`.

### `routes: function()`

Returns the names of all routes.

### `view: function(idOrDomElement)`

Return the View instance with the specified id e.g. `ember352`. If an object 
is provided (such as a DOM element) then the `id` property of the object will be 
used.

### `log: function(valueOrPromise)`

Logs the specified value using `console.log`, or waits until it's resolved if 
it has a `then` method (eg. it's a `Promise`).

### `className: function(object)`

Returns the class name of the object.

### `registry`

Returns the hash of objects in the `container` registry.

### `lookup: function(name)`

Performs a lookup for the named entry in the `container`, which will in turn
ask its `resolver` if it's not found.

### `containerNameFor: function(obj)`

Searches the `container` registry to find the name for the specified object 
(if any).

### `templates`

Returns the keys of all the `Ember.TEMPLATES`.

### `inpsect`

Does what it says, in a manner of speaking. Alias to `Ember.inspect`.

### `observersFor: function(obj, property)`

Returns the set of observers for the specified `property` on `obj`, an alias 
to `Ember.observersFor`.

### `logResolver: function(bool = true)`

Switch logging for the resolver on/off.

### `logAll: function(bool = true)`

Switch logging for all the things on/off.

### `globalize: function()`

Attach all of these useful functions to the `window` object (eww!) - useful
for accessing in the dev tools console.

### `store`

The Ember Data `Store`.

### `typeMaps`

The Ember Data 'type map'.
