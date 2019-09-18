/**
 * @preserve Create and manage a DOM event delegator.
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */
const Delegate = require('./src/js/delegate');

module.exports = function(root) {
	return new Delegate(root);
};

module.exports.Delegate = Delegate;
