/**
 * @preserve Create and manage a DOM event delegator.
 *
 * @version 0.1.1
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Node*/


/**
 * DOM event delegator
 *
 * The delegator will listen for events that bubble up to the root node.
 *
 * @constructor
 * @param {Node|string} root The root node or a selector string matching the root node
 */
function Delegate(root) {
	'use strict';
	var self = this;

	if (typeof root === 'string') {
		root = document.querySelector(root);
	}

	if (!root || !root.addEventListener) {
		throw new TypeError('Root node not specified');
	}


	/**
	 * The root node at which listeners are attached.
	 *
	 * @type Node
	 */
	this.root = root;


	/**
	 * Maintain a map of listener lists, keyed by event name.
	 *
	 * @type Object
	 */
	this.listenerMap = {};


	/** @type function() */
	this.handle = function(event) { Delegate.prototype.handle.call(self, event); };
}


/**
 * @protected
 * @type ?boolean
 */
Delegate.tagsCaseSensitive = null;


/**
 * @param {string} eventType
 * @returns boolean
 */
Delegate.prototype.captureForType = function(eventType) {
	'use strict';
	return eventType === 'error';
};


/**
 * Attach a handler to one event for all elements that match the selector, now or in the future
 *
 * The handler function receives three arguments: the DOM event object, the node that matched the selector while the event was bubbling
 * and a reference to itself. Within the handler, 'this' is equal to the second argument.
 * The node that actually received the event can be accessed via 'event.target'.
 *
 * @param {string} eventType Listen for these events (in a space-separated list)
 * @param {string} selector Only handle events on elements matching this selector
 * @param {function()} handler Handler function - event data passed here will be in event.data
 * @param {Object} [eventData] Data to pass in event.data
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.on = function(eventType, selector, handler, eventData) {
	'use strict';
	var root, listenerMap, matcher, matcherParam, self = this, /** @const */ SEPARATOR = ' ';

	if (!eventType) {
		throw new TypeError('Invalid event type: ' + eventType);
	}

	if (!selector) {
		throw new TypeError('Invalid selector: ' + selector);
	}

	// Support a separated list of event types
	if (eventType.indexOf(SEPARATOR) !== -1) {
		eventType.split(SEPARATOR).forEach(function(singleEventType) {
			self.on(singleEventType, selector, handler, eventData);
		});

		return this;
	}

	// Normalise undefined eventData to null
	if (eventData === undefined) {
		eventData = null;
	}

	if (typeof handler !== 'function') {
		throw new TypeError('Handler must be a type of Function');
	}

	root = this.root;
	listenerMap = this.listenerMap;

	// Add master handler for type if not created yet
	if (!listenerMap[eventType]) {
		root.addEventListener(eventType, this.handle, this.captureForType(eventType));
		listenerMap[eventType] = [];
	}

	// Compile a matcher for the given selector
	if (/^[a-z]+$/i.test(selector)) {

		// Lazily check whether tag names are case sensitive (as in XML or XHTML documents).
		if (Delegate.tagsCaseSensitive === null) {
			Delegate.tagsCaseSensitive = document.createElement('i').tagName === 'i';
		}

		if (!Delegate.tagsCaseSensitive) {
			matcherParam = selector.toUpperCase();
		} else {
			matcherParam = selector;
		}

		matcher = this.matchesTag;
	} else if (/^#[a-z0-9\-_]+$/i.test(selector)) {
		matcherParam = selector.slice(1);
		matcher = this.matchesId;
	} else {
		matcherParam = selector;
		matcher = this.matches;
	}

	// Add to the list of listeners
	listenerMap[eventType].push({
		selector: selector,
		eventData: eventData,
		handler: handler,
		matcher: matcher,
		matcherParam: matcherParam
	});

	return this;
};


/**
 * Remove an event handler for elements that match the selector, forever
 *
 * @param {string} eventType Remove handlers for events matching this type, considering the other parameters
 * @param {string} [selector] If this parameter is omitted, only handlers which match the other two will be removed
 * @param {function()} [handler] If this parameter is omitted, only handlers which match the previous two will be removed
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.off = function(eventType, selector, handler) {
	'use strict';
	var i, listener, listenerMap, listenerList, singleEventType, self = this, /** @const */ SEPARATOR = ' ';

	listenerMap = this.listenerMap;
	if (!eventType) {
		for (singleEventType in listenerMap) {
			if (listenerMap.hasOwnProperty(singleEventType)) {
				this.off(singleEventType, selector, handler);
			}
		}

		return this;
	}

	listenerList = listenerMap[eventType];
	if (!listenerList || !listenerList.length) {
		return this;
	}

	// Support a separated list of event types
	if (eventType.indexOf(SEPARATOR) !== -1) {
		eventType.split(SEPARATOR).forEach(function(singleEventType) {
			self.off(singleEventType, selector, handler);
		});

		return this;
	}

	// Remove only parameter matches if specified
	for (i = listenerList.length - 1; i >= 0; i--) {
		listener = listenerList[i];

		if ((!selector || selector === listener.selector) && (!handler || handler === listener.handler)) {
			listenerList.splice(i, 1);
		}
	}

	// All listeners removed
	if (!listenerList.length) {
		delete listenerList[eventType];

		// Remove the main handler
		this.root.removeEventListener(eventType, this.handle, this.captureForType(eventType));
	}

	return this;
};


/**
 * Handle an arbitrary event.
 *
 * @param {Event} event
 */
Delegate.prototype.handle = function(event) {
	'use strict';
	var i, l, root, listener, returned, listenerList, target, /** @const */ EVENTIGNORE = 'ftLabsDelegateIgnore';

	if (event[EVENTIGNORE] === true) {
		return;
	}

	target = event.target;
	if (target.nodeType === Node.TEXT_NODE) {
		target = target.parentNode;
	}

	root = this.root;
	listenerList = this.listenerMap[event.type];

	// Need to continuously check that the specific list is still populated in case one of the callbacks actually causes the list to be destroyed.
	l = listenerList.length;
	while (target && l) {
		for (i = 0; i < l; i++) {
			listener = listenerList[i];

			// Bail from this loop if the length changed and no more listeners are defined between i and l.
			if (!listener) {
				break;
			}

			// Check for match and fire the event if there's one
			// TODO:MCG:20120117: Need a way to check if event#stopImmediateProgagation was called. If so, break both loops.
			if (listener.matcher.call(target, listener.matcherParam, target)) {
				returned = this.fire(event, target, listener);
			}

			// Stop propagation to subsequent callbacks if the callback returned false
			if (returned === false) {
				event[EVENTIGNORE] = true;
				return;
			}
		}

		// TODO:MCG:20120117: Need a way to check if event#stopProgagation was called. If so, break looping through the DOM.
		// Stop if the delegation root has been reached
		if (target === root) {
			break;
		}

		l = listenerList.length;
		target = target.parentElement;
	}
};


/**
 * Fire a listener on a target.
 *
 * @param {Event} event
 * @param {Node} target
 * @param {Object} listener
 * @returns {boolean}
 */
Delegate.prototype.fire = function(event, target, listener) {
	'use strict';
	var returned, oldData;

	if (listener.eventData !== null) {
		oldData = event.data;
		event.data = listener.eventData;
		returned = listener.handler.call(target, event, target);
		event.data = oldData;
	} else {
		returned = listener.handler.call(target, event, target);
	}

	return returned;
};


/**
 * Check whether an element matches a generic selector.
 *
 * @type function()
 * @param {string} selector A CSS selector
 */
Delegate.prototype.matches = (function(p) {
	'use strict';
	return (p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
}(HTMLElement.prototype));


/**
 * Check whether an element matches a tag selector.
 *
 * Tags are NOT case-sensitive, except in XML (and XML-based languages such as XHTML).
 *
 * @param {string} tagName The tag name to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
Delegate.prototype.matchesTag = function(tagName, element) {
	'use strict';
	return tagName === element.tagName;
};


/**
 * Check whether the ID of the element in 'this' matches the given ID.
 *
 * IDs are case-sensitive.
 *
 * @param {string} id The ID to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
Delegate.prototype.matchesId = function(id, element) {
	'use strict';
	return id === element.id;
};

if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return Delegate;
	});
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = function(root) {
		'use strict';
		return new Delegate(root);
	};

	module.exports.Delegate = Delegate;
}