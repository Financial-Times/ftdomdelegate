# ftdomdelegate

FT's dom delegate library is a component for binding to events on all target elements matching the given selector, irrespective of whether anything exists in the DOM at registration time or not. This allows developers to implement the [event delegation pattern](http://www.sitepoint.com/javascript-event-delegation-is-easier-than-you-think/).

- [Usage](#usage)
- [JavaScript](#javascript)
- [Migration](#migration)
- [Contact](#contact)
- [Licence](#licence)

## Usage

Check out [how to include Origami components in your project](https://origami.ft.com/docs/components/#including-origami-components-in-your-project) to get started with `ftdomdelegate`.

## JavaScript

To import ftdomdelegate:

```js
import Delegate from 'ftdomdelegate';
let myDel = new Delegate(document.body);
```

To instantiate `Delegate` on the `body` and listen to some events:

```js
function handleButtonClicks(event) {
  // Do some things
}

function handleTouchMove(event) {
  // Do some other things
}

document.addEventListener('DOMContentLoaded', function() {
  var delegate = new Delegate(document.body);
  delegate.on('click', 'button', handleButtonClicks);

  // Listen to all touch move
  // events that reach the body
  delegate.on('touchmove', handleTouchMove);
});
```

A cool trick to handle images that fail to load:

```js
function handleImageFail() {
  this.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  var delegate = new Delegate(document.body);
  delegate.on('error', 'img', handleImageFail);
});
```

### .on(eventType[, selector], handler[, useCapture])

#### `eventType (string)`

The event to listen for e.g. `mousedown`, `mouseup`, `mouseout`, `error`, `click`, etc.

#### `selector (string)`

Any kind of valid CSS selector supported by [`matchesSelector`](http://caniuse.com/matchesselector). Some selectors, like `#id` or `tag` will use optimized functions internally that check for straight matches between the ID or tag name of elements.

`null` is also accepted and will match the root element set by `root()`.  Passing a handler function into `.on`'s second argument is equivalent to `.on(eventType, null, handler)`.

#### `handler (function)`

Function that will handle the specified event on elements matching the given selector.  The function will receive two arguments: the native event object and the target element, in that order.

#### `useCapture (boolean)`

Whether or not to listen during the capturing (pass in `true`) or bubbling phase (pass in `false`).  If no value passed in, it will fallback to a 'sensible default', which is `true` for `error`, `blur` and `focus` events and `false` for all other types.

### .off([eventType][, selector][, handler][, useCapture])

Calling `off` with no arguments will remove all registered listeners, effectively resetting the instance.

#### `eventType (string)`

Remove handlers for events matching this type considering the other parameters.

#### `selector (string)`

Only remove listeners registered with the given selector, among the other arguments.

If null passed listeners registered to the root element will be removed.  Passing in a function into `off`'s second parameter is equivalent to `.off(eventType, null, handler[, useCapture])` (the third parameter will be ignored).

#### `handler (function)`

Only remove listeners registered with the given handler function, among the other arguments.  If not provided, remove all handlers.

#### `useCapture (boolean)`

Only remove listeners with `useCapture` set to the value passed in.  If not provided, remove listeners added with `useCapture` set to `true` and `false`.

### .root([element])

#### `element (Node)`

Set the delegate's root node.  If no element passed in the root node will be deleted and the event listeners will be removed.

### .destroy()

Short hand for off() and root(), ie both with no parameters. Used to reset the delegate object.

## Credits and collaboration

FT DOM Delegate was developed by [FT Labs](http://labs.ft.com/), part of the Financial Times. It's now maintained by the [Origami Team](https://origami.ft.com/). The developers of ftdomdelegate were [Matthew Andrews](https://twitter.com/andrewsmatt) and [Matthew Caruana Galizia](http://twitter.com/mcaruanagalizia). Test engineering by [Sam Giles](https://twitter.com/SamuelGiles_). The API is influenced by [jQuery Live](http://api.jquery.com/live/).

## Migration guide

State | Major Version | Last Minor Release | Migration guide |
:---: | :---: | :---: | :---:
✨ active | 5 | N/A | [migrate to v5](MIGRATION.md#migrating-from-v4-to-v5) |
⚠ maintained | 4 | 4.0.6 | [migrate to v4](MIGRATION.md#migrating-from-v3-to-v4) |
⚠ maintained | 3 | 3.1 | [migrate to v3](MIGRATION.md#migrating-from-v2-to-v3) |
╳ deprecated | 2 | 2.2 | N/A |
╳ deprecated | 1 | 1.0 | N/A |
