var config = module.exports;

config["DelegateTests"] = {
	rootPath: '../',
    environment: "browser",
    sources: [
        "lib/delegate.js"
    ],
    tests: [
        "_tests/lib/delegateTest.js"
    ]
};
