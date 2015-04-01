[<img align='right' alt='Build Status' src='https://travis-ci.org/aexmachina/ember-devtools.png'>](https://travis-ci.org/aexmachina/ember-devtools)

# ember-devtools

#### [Visit project page and demo](http://aexmachina.info/ember-devtools)

A collection of useful functions for developing Ember apps. Best served from the console.

## Usage

ember-devtools is an ember-cli addon that adds a handy `devTools` object to your `Ember.Application`.
To access this from the console you have a few options:

1. Set `emberDevTools.global` in your `config/environment.js`.

    ```
    var ENV = {
      APP: {
        emberDevTools: {global: true}
    ```
    You can then access the `devTools` functions globally (eg. you can run `routes()` in the console).
    
    If you'd prefer these functions to be under a prefix set `emberDevTools: {global: 'foo'}` for `foo.routes()`. 
1. Attach your App to global scope and access `devTools` at `App.devTools`:

    ```
    var App = Ember.Application.extend({...});
    window.App = App;
    ```
    You can then access `devTools` in the console as `App.devTools` (eg. `App.devTools.routes()`). 
    The [ember-export-application-global](https://github.com/ember-cli/ember-export-application-global) 
    module can also be used to access your app instance from global scope.

## Functions

### `app: function([name])`

Returns the named application. `name` defaults to `main`.

### `routes: function()`

Returns the names of all routes.

### `route: function([name])`

Returns the named route. `name` defaults to the current route.

### `router: function([name])`

Returns the named router instance. `name` defaults to `main`.

### `model: function([name])`

Returns the model for the named controller. `name` defaults to the the current route.

### `service: function(name)`

Performs a lookup for the named service in the `container` (using ``'service:' + name`).

### `view: function(idOrDomElement)`

Return the View instance with the specified id e.g. `ember352`. If an object
is provided (such as a DOM element) then the `id` property of the object will be
used.

### `controller: function([name])`

Returns the named controller. `name` defaults to the current route.

### `log: function(promise[, property[, getEach]])`

Resolves the `promise` and logs the resolved value using `console.log`.
Also sets `window.$E` to the resolved value so you can access it in the dev
tools console.

If `property` is specified then `$E.get(property)` will be logged.

If `getEach` is true then `$E.getEach(property)` will be logged.

#### Examples:

```
> log(store.find('organisation')) => undefined
> $E.get('length') => 3
> log(store.find('organisation'), 'length') => 3
> log(store.find('organisation'), 'name', true) => array of names
```

### `registry`

Returns the hash of objects in the `container` registry.

### `lookup: function(name)`

Performs a lookup for the named entry in the `container`, which will in turn
ask its `resolver` if it's not found.

### `lookupFactory: function(name)`

Performs a lookup for the named factory (as opposed to a new instance) in the `container`,
which will in turn ask its `resolver` if it's not found.

### `containerNameFor: function(obj)`

Searches the `container` registry to find the name for the specified object
(if any).

### `inspect`

Does what it says, in a manner of speaking. Alias to `Ember.inspect`.

### `logResolver: function(bool = true)`

Switch logging for the resolver on or off.

### `logAll: function(bool = true)`

Switch logging for all the things on/off.

### `globalize: function()`

Attach all of these useful functions to the `window` object (eww!) - useful
for accessing in the console.

### `store`

The Ember Data `Store`.

### `typeMaps`

The Ember Data 'type map'.

## Installation

### Ember CLI

	npm install ember-devtools --save-dev

### Upgrading From v2.0
  
ember-devtools is now dependent on ember-cli.
