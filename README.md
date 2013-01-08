# Delegate #

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
<script type='application/javascript' src='/path/to/fastclick.js'></script>
```

The script must be loaded prior to instantiating a Delegate object.

To instantiate Delegate on the `body`:

```js
window.addEventListener('load', function() {
	new Delegate(document.body);
}, false);
```

### Google Closure Compiler ###

Delegate supports compilation with `ADVANCED_OPTIMIZATIONS` ('advanced mode'), which should reduce its size by about 70% (60% gzipped). Note that exposure of the `Delegate` variable isn't forced therefore you must compile it along with all of your code.

### AMD ###

Delegate has AMD (Asynchronous Module Definition) support. This allows it to be lazy-loaded with an AMD loader, such as [RequireJS](http://requirejs.org/).

### Component ###

Delegate comes with support for installation via the [Component package manager](https://github.com/component/component).

### NPM ###

Installation via the [Node Package Manager](https://npmjs.org/package/fastclick) is supported, although Component is preferred as this is not strictly a Node packagage.

## Tests ##

Tests are run using [buster](http://docs.busterjs.org/en/latest/) and sit in `_tests/`. To run the tests statically:

```
$ cd delegate/
$ buster static -c _tests/buster.js
Starting server on http://localhost:8282/
```

...then point your browser to http://localhost:8282/.

## API ##

### .on(eventType, selector[, eventData], handler) ###

#### `eventType (string)` ####

Space-separated list of events to listen for e.g. `mousedown mouseup mouseout` or `click`.

#### `selector (string)` ####

Any kind of valid CSS selector supported by [`matchesSelector`](http://caniuse.com/matchesselector). Some selectors, like `#id` or `tag` will use optimized functions internally that check for straight matches between the ID or tag name of elements.

#### `eventData (*)` ####

If specified and non-null, will be made available in `event.data`.

#### `handler (function)` ####

Function that will handle the specified event on elements matching the given selector. The function will receive two arguments: the native event object and the target element, in that order.

### .off([eventType][, selector][, handler]) ###

Calling `off` with no arguments will remove all registered listeners, effectively resetting the instance.

#### `eventType (string)` ####

Remove handlers for events matching these types, in a space-separated list, considering the other parameters.

#### `selector (string)` ####

Only remove listeners registered with the given selector, among the other arguments.

#### `handler (function)` ####

Only remove listeners registered with the given handler function, among the other arguments.

## Credits and collaboration ##

The lead developer of Delegate is [Matthew Caruana Galizia](http://twitter.com/mcaruanagalizia) at FT Labs. The API is influenced by [jQuery Live](http://api.jquery.com/live/). All open source code released by FT Labs is licenced under the MIT licence. We welcome comments, feedback and suggestions. Please feel free to raise an issue or pull request. Enjoy.
