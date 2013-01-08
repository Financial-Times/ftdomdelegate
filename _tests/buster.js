var config = module.exports;

config["DelegateTests"] = {
	rootPath: '../',
    environment: "browser",
    extensions: [ require("buster-coverage") ],
    "buster-coverage": {
        outputDirectory: "build/logs/jscoverage", //Write to this directory instead of coverage
        format: "lcov", //At the moment cobertura and lcov are the only ones available
        combinedResultsOnly: true //Write one combined file instead of one for each browser
    },
    sources: [
        "lib/delegate.js"
    ],
    tests: [
        "_tests/lib/delegateTest.js"
    ]
};
