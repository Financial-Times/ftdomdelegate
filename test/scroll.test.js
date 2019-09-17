/* eslint-env mocha, sinon, proclaim */
import Delegate from '../main';
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';

describe("Delegate", () => {

	beforeEach(() => {
		let snip = '<p>text</p>';
		let out = '';
		for (let i = 0, l = 10000; i < l; i++) {
			out += snip;
		}
		document.body.insertAdjacentHTML('beforeend', '<div id="el">' + out + '</div>');
		window.scrollTo(0, 0);
	});

	afterEach(() => {
		let el = document.getElementById('el');
		el.parentNode.removeChild(el);
	});

	it('Test scroll event', done => {

		let delegate = new Delegate(document);
		let windowDelegate = new Delegate(window);
		let spyA = sinon.spy();
		let spyB = sinon.spy();
		delegate.on('scroll', spyA);
		windowDelegate.on('scroll', spyB);

		// Scroll events on some browsers are asynchronous
		window.setTimeout(function () {
			proclaim.isTrue(spyA.calledOnce);
			proclaim.isTrue(spyB.calledOnce);
			delegate.destroy();
			windowDelegate.destroy();

			done();
		}, 100);
		window.scrollTo(0, 100);
	});

	it('Test sub-div scrolling', done => {
		let delegate = new Delegate(document);
		let el = document.getElementById('el');
		el.style.height = '100px';
		el.style.overflow = 'scroll';

		let spyA = sinon.spy();
		delegate.on('scroll', '#el', spyA);

		// Scroll events on some browsers are asynchronous
		window.setTimeout(function () {
			proclaim.isTrue(spyA.calledOnce);
			delegate.destroy();
			done();
		}, 100);

		let event = document.createEvent("MouseEvents");
		event.initMouseEvent('scroll', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		el.dispatchEvent(event);
	});
});
