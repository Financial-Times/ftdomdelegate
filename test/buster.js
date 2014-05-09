var config = module.exports;

config.DelegateTests = {
  rootPath: '../',
  environment: "browser",
  sources: [
    "test/polyfills/matches-selector.js",
    "test/polyfills/event-listener.js",
    "test/polyfills/es5-shim.js",
    "build/dom-delegate.js"
  ],
  tests: [
    "test/tests/delegateTest.js"
  ],
  extensions: [
    require('buster-istanbul')
  ]
};
