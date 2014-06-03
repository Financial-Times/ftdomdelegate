/*jshint laxbreak:true*/

/*global buster, assert, refute, Delegate*/

var setupHelper = {};

setupHelper.setUp = function() {
  document.body.insertAdjacentHTML('beforeend',
    '<div id="container1">'
      + '<div id="delegate-test-clickable" class="delegate-test-clickable">'
        + '<div id="delegate-test-inner-clickable"></div>'
      + '</div>'
      + '<div id="another-delegate-test-clickable"><input id="js-input" /></div>'
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
  var toRemove;
  toRemove = document.getElementById('container1');
  if (toRemove) {
    toRemove.parentNode.removeChild(toRemove);
  }
  toRemove = document.getElementById('container2');
  if (toRemove) {
    toRemove.parentNode.removeChild(toRemove);
  }
};

setupHelper.getMouseEvent = function(eventName, relatedTarget) {
  // TODO: Extend this to be slightly more configurable when initialising the event.
  var event = document.createEvent("MouseEvents");
  event.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, relatedTarget || null);

  return event;
};

buster.testCase('Delegate', {
  'setUp': function() {
    setupHelper.setUp();
  },
  'Delegate#off should remove the event handlers for a selector' : function() {
    var delegate = new Delegate(document);
    var spyA = this.spy(), spyB = this.spy();

    delegate.on('click', '#delegate-test-clickable', spyA);
    delegate.on('click', '#delegate-test-clickable', spyB);

    var element = document.getElementById("delegate-test-clickable");

    element.dispatchEvent(setupHelper.getMouseEvent("click"));

    assert.calledOnce(spyA);
    assert.calledOnce(spyB);

    delegate.off("click", '#delegate-test-clickable');

    element.dispatchEvent(setupHelper.getMouseEvent("click"));

    assert.calledOnce(spyA);
    assert.calledOnce(spyB);
  },
  'ID selectors are supported' : function() {
    var delegate, spy, element;

    delegate = new Delegate(document);
    spy = this.spy();
    delegate.on('click', '#delegate-test-clickable', spy);

    element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spy);

    delegate.off();
  },
  'Destroy destroys' : function() {
    var delegate, spy, element;

    delegate = new Delegate(document);
    spy = this.spy();
    delegate.on('click', '#delegate-test-clickable', spy);

    delegate.destroy();

    element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    refute.called(spy);
  },
  'Tag selectors are supported' : function() {
    var delegate, spy, element;

    delegate = new Delegate(document);
    spy = this.spy();
    delegate.on('click', 'div', function (event) {
      spy();
      return false;
    });

    element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spy);

    delegate.off();
  },
  'Tag selectors are supported for svg' : function() {
    var delegate, spy, element;

    delegate = new Delegate(document);
    spy = this.spy();
    delegate.on('click', 'circle', function (event) {
      spy();
      return false;
    });

    element = document.getElementById('svg-delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spy);

    delegate.off();
  },
  'Scoped direct children selectors are supported' : function() {
    var delegate, spy1, spy2, element;
    var containerEl = document.getElementById("container1");

    spy1 = this.spy();
    spy2 = this.spy();

    delegate = new Delegate(containerEl);
    delegate.on('click', '> #delegate-test-clickable', function (event) {
      spy1();
    });

    delegate.on('click', '> #delegate-test-inner-clickable', function (event) {
      spy2();
    });

    element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    element = document.getElementById('delegate-test-inner-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledTwice(spy1);
    assert.calledOnce(spy2);

    delegate.off();
  },
  'Class name selectors are supported' : function() {
    var delegate, spy, element;

    delegate = new Delegate(document);
    spy = this.spy();
    delegate.on('click', '.delegate-test-clickable', spy);

    element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spy);

    delegate.off();
  },
  'Complex selectors are supported' : function() {
    var delegate, spyA, spyB, element;

    delegate = new Delegate(document);
    spyA = this.spy();
    spyB = this.spy();
    delegate.on('click', 'div.delegate-test-clickable, div[id=another-delegate-test-clickable]', spyA);
    delegate.on('click', 'div.delegate-test-clickable + #another-delegate-test-clickable', spyB);

    element = document.getElementById('another-delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spyA);
    assert.calledOnce(spyB);

    delegate.off();
  },
  'If two click handlers are registered then all handlers should be called on click' : function() {
    var delegate = new Delegate(document);
    var spyA = this.spy(), spyB = this.spy();

    delegate.on("click", '#delegate-test-clickable', spyA);
    delegate.on("click", '#delegate-test-clickable', spyB);

    var element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent("click"));

    assert.calledOnce(spyA);
    assert.calledOnce(spyB);

    delegate.off();
  },
  'Returning false from a callback should stop propagation immediately': function() {
    var delegate = new Delegate(document);

    var spyA = this.spy(), spyB = this.spy();

    delegate.on("click", '#delegate-test-clickable', function() {
      spyA();

      // Return false to stop propagation
      return false;
    });
    delegate.on("click", '#delegate-test-clickable', spyB);

    var element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent("click"));

    assert.calledOnce(spyA);
    refute.calledOnce(spyB);

    delegate.off();
  },
  'Returning false from a callback should preventDefault': function(done) {
    var delegate = new Delegate(document.body);

    var spyA = this.spy();

    delegate.on("click", '#delegate-test-clickable', function(event) {
      spyA();

      setTimeout(function() {
        assert.equals(event.defaultPrevented, true);
        done();
      }, 0);

      return false;
    });

    var element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent("click"));

    assert.calledOnce(spyA);
    delegate.off();
  },
  'Returning false from a callback should stop propagation globally': function() {
    var delegateA = new Delegate(document), delegateB = new Delegate(document);

    var spyA = this.spy(), spyB = this.spy();

    delegateA.on("click", '#delegate-test-clickable', function() {
      spyA();

      // Return false to stop propagation to other delegates
      return false;
    });
    delegateB.on("click", '#delegate-test-clickable', spyB);

    var element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent("click"));

    assert.calledOnce(spyA);
    refute.calledOnce(spyB);

    delegateA.off();
    delegateB.off();
  },
  'Clicking on parent node should not trigger event' : function() {
    var delegate = new Delegate(document);
    var spy = this.spy();

    delegate.on("click", "#delegate-test-clickable", spy);

    document.dispatchEvent(setupHelper.getMouseEvent("click"));

    refute.called(spy);

    var spyA = this.spy();

    delegate.on("click", "#another-delegate-test-clickable", spyA);

    var element = document.getElementById("another-delegate-test-clickable");
    element.dispatchEvent(setupHelper.getMouseEvent("click"));

    assert.calledOnce(spyA);
    refute.calledOnce(spy);

    delegate.off();
  },
  'Exception should be thrown when no handler is specified in Delegate#on' : function() {

    try {
      var delegate = new Delegate(document);
      delegate.on("click", '#delegate-test-clickable');
    } catch (e) {
      assert.match(e, { name: 'TypeError', message: 'Handler must be a type of Function' });
    }
  },
  'Delegate#off with zero arguments should remove all handlers' : function() {
    var delegate = new Delegate(document);
    var spyA = this.spy(), spyB = this.spy();

    delegate.on('click', '#delegate-test-clickable', spyA);
    delegate.on('click', '#another-delegate-test-clickable', spyB);

    delegate.off();

    var element = document.getElementById('delegate-test-clickable'),
      element2 = document.getElementById('another-delegate-test-clickable');

    element.dispatchEvent(setupHelper.getMouseEvent("click"));
    element2.dispatchEvent(setupHelper.getMouseEvent("click"));

    refute.called(spyA);
    refute.called(spyB);

    spyA.reset();
    spyB.reset();

    element.dispatchEvent(setupHelper.getMouseEvent("mouseover", document));
    element2.dispatchEvent(setupHelper.getMouseEvent("mouseover", document));

    refute.called(spyA);
    refute.called(spyB);
  },
  'Regression test: Delegate#off called from a callback should succeed without exception' : function() {
    var delegate = new Delegate(document);
    var spyA = this.spy();

    delegate.on('click', '#delegate-test-clickable', function() {
      spyA();
      delegate.off();
    });

    var element = document.getElementById('delegate-test-clickable');

    refute.exception(function() {
      element.dispatchEvent(setupHelper.getMouseEvent('click'));
    });

    assert.called(spyA);
  },
  'Delegate#off called from a callback should prevent execution of subsequent callbacks' : function() {
    var delegate = new Delegate(document);
    var spyA = this.spy(), spyB = this.spy();

    delegate.on('click', '#delegate-test-clickable', function() {
      spyA();
      delegate.off();
    });
    delegate.on('click', '#delegate-test-clickable', spyB);

    var element = document.getElementById('delegate-test-clickable');

    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.called(spyA);
    refute.called(spyB);
  },
  'Can be instantiated without a root node' : function() {
    var delegate = new Delegate();
    var spyA = this.spy();
    var element = document.getElementById('delegate-test-clickable');

    delegate.on('click', '#delegate-test-clickable', function(event) {
      spyA();
    });

    element.dispatchEvent(setupHelper.getMouseEvent('click'));
    refute.called(spyA);
    delegate.off();
  },
  'Can be bound to an element after its event listeners have been set up' : function() {
    var delegate = new Delegate();
    var spyA = this.spy();
    var element = document.getElementById('delegate-test-clickable');

    delegate.on('click', '#delegate-test-clickable', function(event) {
      spyA();
    });

    element.dispatchEvent(setupHelper.getMouseEvent('click'));
    delegate.root(document);
    element.dispatchEvent(setupHelper.getMouseEvent('click'));
    assert.calledOnce(spyA);
    delegate.off();
  },
  'Can be unbound from an element' : function() {
    var delegate = new Delegate(document);
    var spyA = this.spy();
    var element = document.getElementById('delegate-test-clickable');

    delegate.on('click', '#delegate-test-clickable', function(event) {
      spyA();
    });

    delegate.root();
    element.dispatchEvent(setupHelper.getMouseEvent('click'));
    refute.called(spyA);
    delegate.off();
  },
  'Can be to bound to a different DOM element': function () {
    var spyA = this.spy();
    var element = document.getElementById('element-in-container2-test-clickable');

    // Attach to the first container
    var delegate = new Delegate(document.getElementById('container1'));

    // Listen to elements with class delegate-test-clickable
    delegate.on('click', '.delegate-test-clickable', function(event) {
      spyA();
    });

    // Click the element in the second container
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    // Ensure no click was caught
    refute.called(spyA);

    // Move the listeners to the second container
    delegate.root(document.getElementById('container2'));

    // Click the element in the second container again
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    // Ensure the click was caught
    assert.calledOnce(spyA);

    delegate.off();
  },
  'Regression test: event fired on a text node should bubble normally' : function() {
    var delegate, spy, element, textNode;

    spy = this.spy();

    delegate = new Delegate(document);
    delegate.on('click', '#delegate-test-clickable', spy);

    element = document.getElementById('delegate-test-clickable');
    textNode = document.createTextNode('Test text');
    element.appendChild(textNode);

    textNode.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.called(spy);

    delegate.off();
  },

  // Regression test for - https://github.com/ftlabs/dom-delegate/pull/10
  'Regression test: event listener should be rebound after last event is removed and new events are added.' : function() {
    var delegate, spy, element, textNode;

    spy = this.spy();

    delegate = new Delegate(document);
    delegate.on('click', '#delegate-test-clickable', spy);

    // Unbind event listeners
    delegate.off();

    delegate.on('click', '#delegate-test-clickable', spy);

    element = document.getElementById('delegate-test-clickable');
    textNode = document.createTextNode('Test text');
    element.appendChild(textNode);

    textNode.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.called(spy);

    delegate.off();
  },

  // Test for issue #5
  'The root element, via a null selector, is supported': function() {
    var delegate, spy, element;

    delegate = new Delegate(document.body);
    spy = this.spy();
    delegate.on('click', null, spy);

    element = document.body;
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spy);

    delegate.off();
  },

  // Test for issues #16
  'The root element, when passing a callback into the second parameter, is supported': function() {
    var delegate, spy, element;

    delegate = new Delegate(document.body);
    spy = this.spy();
    delegate.on('click', spy);

    element = document.body;
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spy);

    delegate.off();
  },

  // Test for issue #16
  'Can unset a listener on the root element when passing the callback into the second parameter': function() {
    var element = document.getElementById('element-in-container2-test-clickable');
    var delegate = new Delegate(document.body);
    var spy = this.spy();
    var spy2 = this.spy();

    delegate.on('click', spy);
    delegate.on('click', '#element-in-container2-test-clickable', spy2);

    element.dispatchEvent(setupHelper.getMouseEvent('click'));
    delegate.off('click', spy);
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(spy);
    assert.calledTwice(spy2);

    delegate.off();
  },

  'Regression test: #root is chainable during setting of root': function() {
    var delegate, spy, element;

    delegate = new Delegate();
    spy = this.spy();
    delegate.root(document.body).on('click', null, spy);

    element = document.body;
    element.dispatchEvent(setupHelper.getMouseEvent('click'));
    assert.calledOnce(spy);
    delegate.off();
  },

  'Regression test: #root is chainable during unsetting of root': function() {
    var delegate, spy, element;

    delegate = new Delegate(document.body);
    spy = this.spy();
    delegate.root().on('click', null, spy);
    delegate.root(document.body);

    element = document.body;
    element.dispatchEvent(setupHelper.getMouseEvent('click'));
    assert.calledOnce(spy);
    delegate.off();
  },

  'Focus events can be caught': function() {
    var delegate, spy, element, ev;

    delegate = new Delegate(document.body);
    spy = this.spy();
    spy2 = this.spy();
    delegate.on('focus', 'input', spy);
    element = document.getElementById('js-input');
    ev = document.createEvent('Event');
    ev.initEvent("focus", true, true);
    element.dispatchEvent(ev);
    assert.calledOnce(spy);
  },

  'Blur events can be caught': function() {
    var delegate, spy, element, ev;

    delegate = new Delegate(document.body);
    spy = this.spy();
    spy2 = this.spy();
    delegate.on('blur', 'input', spy);
    element = document.getElementById('js-input');

    ev = document.createEvent('Event');
    ev.initEvent("blur", true, true);
    element.dispatchEvent(ev);

    assert.calledOnce(spy);
  },
  'Test setting useCapture true false works get attached to capturing and bubbling event handlers, respectively' : function() {
    var delegate = new Delegate(document);
    var bubbleSpy = this.spy();
    var captureSpy = this.spy();
    var bubblePhase;
    var capturePhase;

    delegate.on('click', '.delegate-test-clickable', function(event) {
      bubblePhase = event.eventPhase;
      bubbleSpy();
    }, false);
    delegate.on('click', '.delegate-test-clickable', function(event) {
      capturePhase = event.eventPhase;
      captureSpy();
    }, true);

    var element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.equals(1, capturePhase);
    assert.equals(3, bubblePhase);
    assert.callOrder(captureSpy, bubbleSpy);

    // Ensure unbind works properly
    delegate.off();

    element = document.getElementById('delegate-test-clickable');
    element.dispatchEvent(setupHelper.getMouseEvent('click'));

    assert.calledOnce(captureSpy);
    assert.calledOnce(bubbleSpy);
  },

  'tearDown': function() {
    setupHelper.tearDown();
  }
});
