buster.testCase('Delegate', {
  'setUp': function() {
    var snip = '<p>text</p>';
    var out = '';
    for (var i = 0, l = 10000; i < l; i++) {
      out += snip;
    }
    document.body.insertAdjacentHTML('beforeend', '<div id="el">'+out+'</div>');
    window.scrollTo(0, 0);
  },
  'Test scroll event' : function() {
    var promise = {
      then: function (callback) {
        this.callbacks = this.callbacks || [];
        this.callbacks.push(callback);
      }
    };

    var delegate = new Delegate(document);
    var windowDelegate = new Delegate(window);
    var spyA = this.spy();
    var spyB = this.spy();
    delegate.on('scroll', spyA);
    windowDelegate.on('scroll', spyB);

    // Scroll events on some browsers are asynchronous
    window.setTimeout(function() {
      assert.calledOnce(spyA);
      assert.calledOnce(spyB);
      delegate.destroy();
      windowDelegate.destroy();

      callbacks = promise.callbacks || [];
      for (var i = 0, l = callbacks.length; i < l; ++i) {
        callbacks[i]();
      }
    }, 100);
    window.scrollTo(0, 100);
    return promise;
  },
  'Test sub-div scrolling': function() {
    var promise = {
      then: function (callback) {
        this.callbacks = this.callbacks || [];
        this.callbacks.push(callback);
      }
    };

    var delegate = new Delegate(document);
    var el = document.getElementById('el');
    el.style.height = '100px'
    el.style.overflow = 'scroll';

    var spyA = this.spy();
    delegate.on('scroll', '#el', spyA);

    // Scroll events on some browsers are asynchronous
    window.setTimeout(function() {
      assert.calledOnce(spyA);
      delegate.destroy();

      callbacks = promise.callbacks || [];
      for (var i = 0, l = callbacks.length; i < l; ++i) {
        callbacks[i]();
      }
    }, 100);
    el.scrollByLines(1);
    return promise;
  },
  'tearDown': function() {
    var el = document.getElementById('el');
    el.parentNode.removeChild(el);
  }
});
