var config = module.exports;

config["DelegateTests"] = {
	rootPath: '../',
    environment: "browser",
    extensions: [ require("buster-coverage") ],
    "buster-coverage": {
        outputDirectory: "build/logs/jscoverage",
        format: "lcov",
        combinedResultsOnly: true
    },
    sources: [
        "lib/delegate.js"
    ],
    tests: [
        "_tests/lib/delegateTest.js"
    ]
};
