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
    var spyA = this.spy();
    delegate.on('scroll', spyA);

    window.setTimeout(function() {
      assert.calledOnce(spyA);
      delegate.destroy();

      callbacks = promise.callbacks || [];
      for (var i = 0, l = callbacks.length; i < l; ++i) {
        callbacks[i]();
      }
    }, 100);
    window.scrollTo(0, 100);
    return promise;
  },
  'tearDown': function() {
    var el = document.getElementById('el');
    el.parentNode.removeChild(el);
  }
});