var config = module.exports;

config["DelegateTests"] = {
  rootPath: '../',
  environment: "browser",
  extensions: [ require("buster-coverage") ],
  sources: [
    "build/dom-delegate.js"
  ],
  tests: [
    "test/tests/*.js"
  ]
};
