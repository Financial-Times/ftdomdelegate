var config = module.exports;

config.DelegateTests = {
  rootPath: '../',
  environment: "browser",
  sources: [
    "test/helpers/es5-shim.js",
    "test/helpers/event-listener.js",
    "build/dom-delegate.js"
  ],
  tests: [
    "test/tests/*.js"
  ],
  extensions: [
    require('buster-istanbul')
  ]
};
