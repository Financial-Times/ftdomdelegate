/* eslint-env mocha, sinon, proclaim */
import Delegate from '../main';
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';

let setupHelper = {};

setupHelper.setUp = function() {
	document.body.insertAdjacentHTML('beforeend',
		'<div id="container1">'
			+ '<div id="delegate-test-clickable" class="delegate-test-clickable"></div>'
			+ '<div id="another-delegate-test-clickable"><input id="js-input" /></div>'
			+ '<div id="custom-event"></div>'
		+ '</div>'
		+ '<div id="container2">'
			+ '<div id="element-in-container2-test-clickable" class="delegate-test-clickable"></div>'
		+ '</div>'
		+ '<svg viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg">'
			+ '<circle id="svg-delegate-test-clickable" cx="60" cy="60" r="50"/>'
		+ '</svg>'
	);
};

setupHelper.tearDown = function() {
	let toRemove;
	toRemove = document.getElementById('container1');
	if (toRemove) {
		toRemove.parentNode.removeChild(toRemove);
	}
	toRemove = document.getElementById('container2');
	if (toRemove) {
		toRemove.parentNode.removeChild(toRemove);
	}
};

setupHelper.fireMouseEvent = function(target, eventName, relatedTarget) {
	// TODO: Extend this to be slightly more configurable when initialising the event.
	let ev;
	if (document.createEvent) {
		ev = document.createEvent("MouseEvents");
		ev.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, relatedTarget || null);
		target.dispatchEvent(ev);
	} else if ( document.createEventObject ) {
		ev = document.createEventObject();
		target.fireEvent( 'on' + eventName, ev);
	}
};

setupHelper.fireFormEvent = function (target, eventName) {
	let ev;
	if (document.createEvent) {
		ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		target.dispatchEvent(ev);
	} else if ( document.createEventObject ) {
		ev = document.createEventObject();
		target.fireEvent( 'on' + eventName, ev);
	}
};

setupHelper.fireCustomEvent = function(target, eventName) {
	let ev = new Event(eventName, {
		bubbles: true
	});
	target.dispatchEvent(ev);
};

describe("Delegate", () => {
	beforeEach(() => {
		setupHelper.setUp();
	});

	afterEach(() => {
		setupHelper.tearDown();
	});

	it('Delegate#off should remove the event handlers for a selector', () => {
		let delegate = new Delegate(document);
		let spyA = sinon.spy();
		let spyB = sinon.spy();

		delegate.on('click', '#delegate-test-clickable', spyA);
		delegate.on('click', '#delegate-test-clickable', spyB);

		let element = document.getElementById("delegate-test-clickable");

		setupHelper.fireMouseEvent(element, "click");

		proclaim.isTrue(spyA.calledOnce);
		proclaim.isTrue(spyB.calledOnce);

		delegate.off("click", '#delegate-test-clickable');

		setupHelper.fireMouseEvent(element, "click");

		proclaim.isTrue(spyA.calledOnce);
		proclaim.isTrue(spyB.calledOnce);
	});

	it('ID selectors are supported', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document);
		spy = sinon.spy();
		delegate.on('click', '#delegate-test-clickable', spy);

		element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.calledOnce);

		delegate.off();
	});

	it('Destroy destroys', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document);
		spy = sinon.spy();
		delegate.on('click', '#delegate-test-clickable', spy);

		delegate.destroy();

		element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isFalse(spy.called);
	});

	it('Tag selectors are supported', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document);
		spy = sinon.spy();
		delegate.on('click', 'div', function () {
			spy();
			return false;
		});

		element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.calledOnce);

		delegate.off();
	});

	it('Tag selectors are supported for svg', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document);
		spy = sinon.spy();
		delegate.on('click', 'circle', function () {
			spy();
			return false;
		});

		element = document.getElementById('svg-delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.calledOnce);

		delegate.off();
	});

	it('Class name selectors are supported', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document);
		spy = sinon.spy();
		delegate.on('click', '.delegate-test-clickable', spy);

		element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.calledOnce);

		delegate.off();
	});

	it('Complex selectors are supported', () => {
		let delegate;
		let spyA;
		let spyB;
		let element;

		delegate = new Delegate(document);
		spyA = sinon.spy();
		spyB = sinon.spy();
		delegate.on('click', 'div.delegate-test-clickable, div[id=another-delegate-test-clickable]', spyA);
		delegate.on('click', 'div.delegate-test-clickable + #another-delegate-test-clickable', spyB);

		element = document.getElementById('another-delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spyA.calledOnce);
		proclaim.isTrue(spyB.calledOnce);

		delegate.off();
	});

	it('If two click handlers are registered then all handlers should be called on click', () => {
		let delegate = new Delegate(document);
		let spyA = sinon.spy();
		let spyB = sinon.spy();

		delegate.on("click", '#delegate-test-clickable', spyA);
		delegate.on("click", '#delegate-test-clickable', spyB);

		let element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, "click");

		proclaim.isTrue(spyA.calledOnce);
		proclaim.isTrue(spyB.calledOnce);

		delegate.off();
	});

	it('Returning false from a callback should stop propagation immediately', () => {
		let delegate = new Delegate(document);

		let spyA = sinon.spy();
		let spyB = sinon.spy();

		delegate.on("click", '#delegate-test-clickable', function () {
			spyA();

			// Return false to stop propagation
			return false;
		});
		delegate.on("click", '#delegate-test-clickable', spyB);

		let element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, "click");

		proclaim.isTrue(spyA.calledOnce);
		proclaim.isFalse(spyB.calledOnce);

		delegate.off();
	});

	it('Returning false from a callback should preventDefault', (done) => {
		let delegate = new Delegate(document.body);

		let spyA = sinon.spy();

		delegate.on("click", '#delegate-test-clickable', function (event) {
			spyA();

			// event.defaultPrevented appears to have issues in IE so just mock
			// preventDefault instead.
			let defaultPrevented;
			event.preventDefault = function () {
				defaultPrevented = true;
			};

			setTimeout(function () {
				proclaim.isTrue(defaultPrevented);
				done();
			}, 0);

			return false;
		});

		let element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, "click");

		proclaim.isTrue(spyA.calledOnce);
		delegate.off();
	});

	it('Returning false from a callback should stop propagation globally', () => {
		let delegateA = new Delegate(document);
		let delegateB = new Delegate(document);

		let spyA = sinon.spy();
		let spyB = sinon.spy();

		delegateA.on("click", '#delegate-test-clickable', function() {
			spyA();

			// Return false to stop propagation to other delegates
			return false;
		});
		delegateB.on("click", '#delegate-test-clickable', spyB);

		let element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, "click");

		proclaim.isTrue(spyA.calledOnce);
		proclaim.isFalse(spyB.calledOnce);

		delegateA.off();
		delegateB.off();
	});


	it('Clicking on parent node should not trigger event', () => {
		let delegate = new Delegate(document);
		let spy = sinon.spy();

		delegate.on("click", "#delegate-test-clickable", spy);

		setupHelper.fireMouseEvent(document, "click");

		proclaim.isFalse(spy.called);

		let spyA = sinon.spy();

		delegate.on("click", "#another-delegate-test-clickable", spyA);

		let element = document.getElementById("another-delegate-test-clickable");
		setupHelper.fireMouseEvent(element, "click");

		proclaim.isTrue(spyA.calledOnce);
		proclaim.isFalse(spy.calledOnce);

		delegate.off();
	});

	it('Exception should be thrown when no handler is specified in Delegate#on', (done) => {
		try {
			let delegate = new Delegate(document);
			delegate.on("click", '#delegate-test-clickable');
		} catch (e) {
			proclaim.equal(e.name, 'TypeError');
			proclaim.equal(e.message, 'Handler must be a type of Function');
			done();
		}
		done(new Error('Did not error.'));
	});

	it('Delegate#off with zero arguments should remove all handlers', () => {
		let delegate = new Delegate(document);
		let spyA = sinon.spy();
		let spyB = sinon.spy();

		delegate.on('click', '#delegate-test-clickable', spyA);
		delegate.on('click', '#another-delegate-test-clickable', spyB);

		delegate.off();

		let element = document.getElementById('delegate-test-clickable');
		let element2 = document.getElementById('another-delegate-test-clickable');

		setupHelper.fireMouseEvent(element, "click");
		setupHelper.fireMouseEvent(element2, "click");

		proclaim.isFalse(spyA.called);
		proclaim.isFalse(spyB.called);

		spyA.resetHistory();
		spyB.resetHistory();

		setupHelper.fireMouseEvent(element, "mouseover", document);
		setupHelper.fireMouseEvent(element2, "mouseover", document);

		proclaim.isFalse(spyA.called);
		proclaim.isFalse(spyB.called);
	});

	it('Regression test: Delegate#off called from a callback should succeed without exception', () => {
		let delegate = new Delegate(document);
		let spyA = sinon.spy();

		delegate.on('click', '#delegate-test-clickable', function () {
			spyA();
			delegate.off();
		});

		let element = document.getElementById('delegate-test-clickable');

		proclaim.doesNotThrow(function () {
			setupHelper.fireMouseEvent(element, 'click');
		});

		proclaim.isTrue(spyA.called);
	});

	it('Delegate#off called from a callback should prevent execution of subsequent callbacks', () => {
		let delegate = new Delegate(document);
		let spyA = sinon.spy();
		let spyB = sinon.spy();

		delegate.on('click', '#delegate-test-clickable', function () {
			spyA();
			delegate.off();
		});
		delegate.on('click', '#delegate-test-clickable', spyB);

		let element = document.getElementById('delegate-test-clickable');

		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spyA.called);
		proclaim.isFalse(spyB.called);
	});

	it('Can be instantiated without a root node', () => {
		let delegate = new Delegate();
		let spyA = sinon.spy();
		let element = document.getElementById('delegate-test-clickable');

		delegate.on('click', '#delegate-test-clickable', function () {
			spyA();
		});

		setupHelper.fireMouseEvent(element, 'click');
		proclaim.isFalse(spyA.called);
		delegate.off();
	});

	it('Can be bound to an element after its event listeners have been set up', () => {
		let delegate = new Delegate();
		let spyA = sinon.spy();
		let element = document.getElementById('delegate-test-clickable');

		delegate.on('click', '#delegate-test-clickable', function () {
			spyA();
		});

		setupHelper.fireMouseEvent(element, 'click');
		delegate.root(document);
		setupHelper.fireMouseEvent(element, 'click');
		proclaim.isTrue(spyA.calledOnce);
		delegate.off();
	});

	it('Can be unbound from an element', () => {
		let delegate = new Delegate(document);
		let spyA = sinon.spy();
		let element = document.getElementById('delegate-test-clickable');

		delegate.on('click', '#delegate-test-clickable', function () {
			spyA();
		});

		delegate.root();
		setupHelper.fireMouseEvent(element, 'click');
		proclaim.isFalse(spyA.called);
		delegate.off();
	});

	it('Can be to bound to a different DOM element', () => {
		let spyA = sinon.spy();
		let element = document.getElementById('element-in-container2-test-clickable');

		// Attach to the first container
		let delegate = new Delegate(document.getElementById('container1'));

		// Listen to elements with class delegate-test-clickable
		delegate.on('click', '.delegate-test-clickable', function () {
			spyA();
		});

		// Click the element in the second container
		setupHelper.fireMouseEvent(element, 'click');

		// Ensure no click was caught
		proclaim.isFalse(spyA.called);

		// Move the listeners to the second container
		delegate.root(document.getElementById('container2'));

		// Click the element in the second container again
		setupHelper.fireMouseEvent(element, 'click');

		// Ensure the click was caught
		proclaim.isTrue(spyA.calledOnce);

		delegate.off();
	});

	it('Regression test: event fired on a text node should bubble normally', () => {
		let delegate;
		let spy;
		let element;
		let textNode;

		spy = sinon.spy();

		delegate = new Delegate(document);
		delegate.on('click', '#delegate-test-clickable', spy);

		element = document.getElementById('delegate-test-clickable');
		textNode = document.createTextNode('Test text');
		element.appendChild(textNode);

		setupHelper.fireMouseEvent(textNode, 'click');

		proclaim.isTrue(spy.called);

		delegate.off();
	});


	// Regression test for - https://github.com/ftlabs/dom-delegate/pull/10
	it('Regression test: event listener should be rebound after last event is removed and new events are added.', () => {
		let delegate;
		let spy;
		let element;

		spy = sinon.spy();

		delegate = new Delegate(document);
		delegate.on('click', '#delegate-test-clickable', spy);

		// Unbind event listeners
		delegate.off();

		delegate.on('click', '#delegate-test-clickable', spy);

		element = document.getElementById('delegate-test-clickable');

		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.called);

		delegate.off();
	});


	// Test for issue #5
	it('The root element, via a null selector, is supported', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document.body);
		spy = sinon.spy();
		delegate.on('click', null, spy);

		element = document.body;
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.calledOnce);

		delegate.off();
	});


	// Test for issues #16
	it('The root element, when passing a callback into the second parameter, is supported', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document.body);
		spy = sinon.spy();
		delegate.on('click', spy);

		element = document.body;
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.calledOnce);

		delegate.off();
	});


	// Test for issue #16
	it('Can unset a listener on the root element when passing the callback into the second parameter', () => {
		let element = document.getElementById('element-in-container2-test-clickable');
		let delegate = new Delegate(document.body);
		let spy = sinon.spy();
		let spy2 = sinon.spy();

		delegate.on('click', spy);
		delegate.on('click', '#element-in-container2-test-clickable', spy2);

		setupHelper.fireMouseEvent(element, 'click');
		delegate.off('click', spy);
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(spy.calledOnce);
		proclaim.isTrue(spy2.called);

		delegate.off();
	});


	it('Regression test: #root is chainable during setting of root', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate();
		spy = sinon.spy();
		delegate.root(document.body).on('click', null, spy);

		element = document.body;
		setupHelper.fireMouseEvent(element, 'click');
		proclaim.isTrue(spy.calledOnce);
		delegate.off();
	});


	it('Regression test: #root is chainable during unsetting of root', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document.body);
		spy = sinon.spy();
		delegate.root().on('click', null, spy);
		delegate.root(document.body);

		element = document.body;
		setupHelper.fireMouseEvent(element, 'click');
		proclaim.isTrue(spy.calledOnce);
		delegate.off();
	});


	it('Focus events can be caught', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document.body);
		spy = sinon.spy();
		delegate.on('focus', 'input', spy);
		element = document.getElementById('js-input');
		setupHelper.fireFormEvent(element, 'focus');
		proclaim.isTrue(spy.calledOnce);
	});

	it('Blur events can be caught', () => {
		let delegate;
		let spy;
		let element;

		delegate = new Delegate(document.body);
		spy = sinon.spy();
		delegate.on('blur', 'input', spy);
		element = document.getElementById('js-input');
		setupHelper.fireFormEvent(element, 'blur');
		proclaim.isTrue(spy.calledOnce);
	});

	it('Test setting useCapture true false works get attached to capturing and bubbling event handlers, respectively', () => {
		let delegate = new Delegate(document);
		let bubbleSpy = sinon.spy();
		let captureSpy = sinon.spy();
		let bubblePhase;
		let capturePhase;

		delegate.on('click', '.delegate-test-clickable', function (event) {
			bubblePhase = event.eventPhase;
			bubbleSpy();
		}, false);
		delegate.on('click', '.delegate-test-clickable', function (event) {
			capturePhase = event.eventPhase;
			captureSpy();
		}, true);

		let element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.equal(capturePhase, 1);
		proclaim.equal(bubblePhase, 3);
		proclaim.isTrue(captureSpy.called, bubbleSpy);

		// Ensure unbind works properly
		delegate.off();

		element = document.getElementById('delegate-test-clickable');
		setupHelper.fireMouseEvent(element, 'click');

		proclaim.isTrue(captureSpy.calledOnce);
		proclaim.isTrue(bubbleSpy.calledOnce);
	});

	it('Custom events are supported', () => {
		let delegate = new Delegate(document.body);
		let spyOnContainer = sinon.spy();
		let spyOnElement = sinon.spy();

		delegate.on('foobar', '#container1', function () {
			spyOnContainer();
		});

		delegate.on('foobar', '#custom-event', function () {
			spyOnElement();
		});

		setupHelper.fireCustomEvent(document.getElementById("custom-event"), 'foobar');

		proclaim.isTrue(spyOnContainer.calledOnce);
		proclaim.isTrue(spyOnElement.calledOnce);
	});

});
