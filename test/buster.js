var config = module.exports;

config.DelegateTests = {
  rootPath: '../',
  environment: "browser",
  sources: [

    // The 3 polyfills below are needed for testing in ie8
    // "https://gist.githubusercontent.com/jonathantneal/3062955/raw/ad9d969c4e55581edbbb293c74135a751f586664/matchesSelector.polyfill.js",
    // "https://raw.githubusercontent.com/jonathantneal/EventListener/master/EventListener.js",
    // "http://cdnjs.cloudflare.com/ajax/libs/es5-shim/2.3.0/es5-shim.min.js",

    "build/ftdomdelegate.js"
  ],
  tests: [
    "test/tests/delegateTest.js"
  ],
  extensions: [
    require('buster-istanbul')
  ]
};
