# dom-delegate [![Build Status](https://travis-ci.org/ftlabs/dom-delegate.png?branch=master)](https://travis-ci.org/ftlabs/dom-delegate)

FT's dom-delegate is a simple, easy-to-use component for binding to events on all target elements matching the given selector, irrespective of whether anything exists in the DOM at registration time or not. This allows developers to implement the [event delegation pattern](http://www.sitepoint.com/javascript-event-delegation-is-easier-than-you-think/).

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

## Installation ##

```
npm install dom-delegate
```

or

```
bower install dom-delegate
```

or

Download the [production version](http://github.com/ftlabs/dom-delegate/raw/master/build/dom-delegate.min.js) (<1k gzipped) or the [development version](http://github.com/ftlabs/dom-delegate/raw/master/build/dom-delegate.js).

## Usage ##

The script must be loaded prior to instantiating a Delegate object.

To instantiate Delegate on the `body` and listen to some events:

```js
function handleButtonClicks(event) {
  // do some things
}

function handleTouchMove(event) {
  // do some other things
}

window.addEventListener('load', function() {
  var delegate = new Delegate(document.body);
  delegate.on('click', 'button', handleButtonClicks);

  // Listen to all touch move
  // events that reach the body
  delegate.on('touchmove', handleTouchMove);

}, false);
```

A cool trick to handle images that fail to load:

```js
function handleImageFail() {
  this.style.display = 'none';
}

window.addEventListener('load', function() {
  var delegate = new Delegate(document.body);
  delegate.on('error', 'img', handleImageFail);
}, false);
```

Note: as of 0.1.2 you do not need to provide a DOM element at the point of instantiation, it can be set later via the `root` method.

Also note: as of 0.2.0 you cannot specify more than one `eventType` in a single call to `off` or `on`.

### Google Closure Compiler ###

Delegate supports compilation with `ADVANCED_OPTIMIZATIONS` ('advanced mode'), which should reduce its size by about 70% (60% gzipped). Note that exposure of the `Delegate` variable isn't forced therefore you must compile it along with all of your code.

## Tests ##

Tests are run using [buster](http://docs.busterjs.org/en/latest/) and sit in `test/`. To run the tests statically:

```
$ cd dom-delegate/
$ buster static -c test/buster.js
Starting server on http://localhost:8282/
```

...then point your browser to http://localhost:8282/. To generate code coverage reports, for which [buster-coverage](https://github.com/ebi/buster-coverage) is required:

```
$ buster server
buster-server running on http://localhost:1111
```

Point your browser to http://localhost:1111 and capture it, then in another terminal tab:

```
$ buster test -c test/buster.js
```

The report in `build/logs/jscoverage/` can be processed using `genhtml`, which is installed with `lcov`.

## API ##

### .on(eventType, selector, handler[, eventData]) ###

#### `eventType (string)` ####

The event to listen for e.g. `mousedown`, `mouseup`, `mouseout`, `error` or `click`.

#### `selector (string|function)` ####

Any kind of valid CSS selector supported by [`matchesSelector`](http://caniuse.com/matchesselector). Some selectors, like `#id` or `tag` will use optimized functions internally that check for straight matches between the ID or tag name of elements.

`null` is also accepted and will match the root element set by `root()`.  Passing a handler function into `.on`'s second argument (with `eventData` as an optional third parameter) is equivalent to `.on(eventType, null, handler[, eventData])`.

#### `handler (function|*)` ####

Function that will handle the specified event on elements matching the given selector. The function will receive two arguments: the native event object and the target element, in that order.

#### `eventData (*)` ####

If defined and non-null, will be made available in `event.data`.

### .off([eventType][, selector][, handler]) ###

Calling `off` with no arguments will remove all registered listeners, effectively resetting the instance.

#### `eventType (string)` ####

Remove handlers for events matching this type considering the other parameters.

#### `selector (string|function)` ####

Only remove listeners registered with the given selector, among the other arguments.

If null passed listeners registered to the root element will be removed.  Passing in a function into `off`'s second parameter is equivalent to `.off(eventType, null, handler)` (the third parameter will be ignored).

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
