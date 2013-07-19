var config = module.exports;

config["DelegateTests"] = {
  rootPath: '../',
  environment: "browser",
  sources: [
    "build/dom-delegate.js"
  ],
  tests: [
    "test/tests/*.js"
  ],
  extensions: [
    require('buster-istanbul')
  ]
};
