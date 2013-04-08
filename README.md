# Delegate #

[![Build Status](https://travis-ci.org/ftlabs/delegate.png?branch=master)](https://travis-ci.org/ftlabs/delegate)

Delegate is a simple, easy-to-use component for binding to events on all target elements matching the given selector, irrespective of whether they exist at registration time or not. This allows developers to implement the [event delegation pattern](http://www.sitepoint.com/javascript-event-delegation-is-easier-than-you-think/).

Delegate is developed by [FT Labs](http://labs.ft.com/), part of the Financial Times.

## Compatibility ##

The library has been deployed as part of the [FT Web App](http://app.ft.com/) and is tried and tested on the following browsers:

* Safari 5 +
* Mobile Safari on iOS 3 +
* Chrome 1 +
* Chrome on iOS 5 +
* Chrome on Android 4.0 +
* Opera 11.5 +
* Opera Mobile 11.5 +
* Firefox 4 +
* Internet Explorer 9 +
* Android Browser on Android 2 +
* PlayBook OS 1 +

## Usage ##

Include delegate.js in your JavaScript bundle or add it to your HTML page like this:

```html
<script type='application/javascript' src='/path/to/delegate.js'></script>
```

The script must be loaded prior to instantiating a Delegate object.

To instantiate Delegate on the `body`:

```js
window.addEventListener('load', function() {
	new Delegate(document.body);
}, false);
```

Note: as of 0.1.2 you do not need to provide a DOM element at the point of instantiation, it can be set later via the `root` method.

### Google Closure Compiler ###

Delegate supports compilation with `ADVANCED_OPTIMIZATIONS` ('advanced mode'), which should reduce its size by about 70% (60% gzipped). Note that exposure of the `Delegate` variable isn't forced therefore you must compile it along with all of your code.

### AMD ###

Delegate has AMD (Asynchronous Module Definition) support. This allows it to be lazy-loaded with an AMD loader, such as [RequireJS](http://requirejs.org/).

### Component ###

Delegate comes with support for installation via the [Component package manager](https://github.com/component/component).

### NPM ###

Installation via the [Node Package Manager](https://npmjs.org/package/dom-delegate) is supported, although Component is preferred as this is not strictly a Node package.

## Tests ##

Tests are run using [buster](http://docs.busterjs.org/en/latest/) and sit in `_tests/`. To run the tests statically:

```
$ cd dom-delegate/
$ buster static -c _tests/buster.js
Starting server on http://localhost:8282/
```

...then point your browser to http://localhost:8282/. To generate code coverage reports, for which [buster-coverage](https://github.com/ebi/buster-coverage) is required:

```
$ buster server
buster-server running on http://localhost:1111
```

Point your browser to http://localhost:1111 and capture it, then in another terminal tab:

```
$ buster test -c _tests/buster.js
```

The report in `build/logs/jscoverage/` can be processed using `genhtml`, which is installed with `lcov`.

## API ##

### .on(eventType, selector, handler[, eventData]) ###

#### `eventType (string)` ####

Space-separated list of events to listen for e.g. `mousedown mouseup mouseout` or `click`.

#### `selector (string)` ####

Any kind of valid CSS selector supported by [`matchesSelector`](http://caniuse.com/matchesselector). Some selectors, like `#id` or `tag` will use optimized functions internally that check for straight matches between the ID or tag name of elements.

Null is also accepted and will match the root element set by `root()`.

#### `handler (function)` ####

Function that will handle the specified event on elements matching the given selector. The function will receive two arguments: the native event object and the target element, in that order.

#### `eventData (*)` ####

If defined and non-null, will be made available in `event.data`.

### .off([eventType][, selector][, handler]) ###

Calling `off` with no arguments will remove all registered listeners, effectively resetting the instance.

#### `eventType (string)` ####

Remove handlers for events matching these types, in a space-separated list, considering the other parameters.

#### `selector (string)` ####

Only remove listeners registered with the given selector, among the other arguments.

#### `handler (function)` ####

Only remove listeners registered with the given handler function, among the other arguments.

### .root([element]) ###

#### `element (Node|string)` ####

Set the delegate's root node or a selector string matching the root node.

If no element or string passed in the root node will be deleted and the event listeners will be removed.

### .destroy() ###

Short hand for off() and root(), ie both with no parameters. Used to reset the delegate object.

## Credits and collaboration ##

The developers of Delegate are [Matthew Andrews](https://twitter.com/andrewsmatt) and [Matthew Caruana Galizia](http://twitter.com/mcaruanagalizia). Test engineering by [Sam Giles](https://twitter.com/SamuelGiles_). The API is influenced by [jQuery Live](http://api.jquery.com/live/). All open source code released by FT Labs is licenced under the MIT licence. We welcome comments, feedback and suggestions. Please feel free to raise an issue or pull request. Enjoy.
