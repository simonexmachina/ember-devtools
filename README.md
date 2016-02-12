[<img align='right' alt='Build Status' src='https://travis-ci.org/aexmachina/ember-devtools.png'>](https://travis-ci.org/aexmachina/ember-devtools)

# ember-devtools

#### [Visit project page and demo](http://simonwade.me/ember-devtools)

A collection of useful functions for developing Ember apps. Best served from the console.

## Usage

ember-devtools is an `Ember.Service` that can be accessed from the container, although it's most
useful when available in the console. The simplest was access this from the console is using
a global variable (eww!) which can be defined in `config/environment.js`.

```js
var ENV = {
  'ember-devtools': {
    global: true,
    enabled: environment === 'development'
  }
}
```

Setting `global` will allow access to the `devTools` functions globally (eg. you can run `routes()` in the console). If you'd prefer these functions to be under a prefix set `global: 'foo'` for `foo.routes()`.

The `enabled` option will enable the addon. By default, this addon will only be included in the `development` environment.

Alternatively you can use `Ember.inject.service('ember-devtools')` or `appInstance.lookup('service:ember-devtools')`.

## Functions

### `app([name])`

Returns the named application. `name` defaults to `main`.

### `routes()`

Returns the names of all routes.

### `route([name])`

Returns the named route. `name` defaults to the current route.

### `router([name])`

Returns the named router instance. `name` defaults to `main`.

### `model([name])`

Returns the model for the named controller. `name` defaults to the the current route.

### `service(name)`

Performs a lookup for the named service in the `container` (using ``'service:' + name`).

### `controller([name])`

Returns the named controller. `name` defaults to the current route.

### `component(idDomElementOrSelector, type)`

Returns the component intance based his id and type.

### `log(promise[, property[, getEach]])`

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

### `lookup(name)`

Performs a lookup for the named entry in the `container`, which will in turn
ask its `resolver` if it's not found.

### `resolveRegistration(name)`

Performs a lookup for the named factory in the `registry`.

### `containerNameFor(obj)`

Searches the `container` to find the name for the specified object (if any).

### `inspect`

Does what it says, in a manner of speaking. Alias to `Ember.inspect`.

### `logResolver(bool = true)`

Switch logging for the resolver on or off.

### `logAll(bool = true)`

Switch logging for all the things on/off.

### `logRenders()`

Logs the rendering duration (in milliseconds) of each component, view and helper.

### `globalize()`

Attach all of these useful functions to the `window` object (eww!) - useful
for accessing in the console.

### `store`

The Ember Data `Store`.

### `typeMaps`

The Ember Data 'type map'.

### `environment`

Returns the Application environment

## Installation

### Ember CLI

	npm install ember-devtools --save-dev

### Upgrading From v2.0

ember-devtools is now dependent on ember-cli.
