/**
 * Copyright (c) 2013-2016 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint node: true, mocha: true, expr: true */
/* globals browser: false */

'use strict';

var expect = require('chai').expect;
// var util = require('util');
require('./selenium')(browser);

var WAIT = 2000;
var IPHONE5 = {
    HEIGHT: 568,
    WIDTH: 320
};

/**
 * Enhance browser with our Ex functions
 */
require('./selenium')(browser);

describe('Kidoju Mobile', function () {

    var tabId;

    before(function (done) {
        if (browser.desiredCapabilities.browserName === 'firefox') {
            // This prevents `No such content frame; perhaps the listener was not registered?`
            browser.pause(200);
        }
        browser.url('/index.html');
        tabId = browser.getCurrentTabId();
        // Note: it won't work in PhantomJS without settings the window size
        browser.windowHandleSize({ width: IPHONE5.WIDTH, height: IPHONE5.HEIGHT });
        browser.execute(function () {
            var SRC = './js/app.rapi.mock.js';
            var head = document.getElementsByTagName('head')[0];
            var scripts = head.getElementsByTagName('script');
            var found = false;
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src === SRC) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = SRC;
                head.appendChild(script);
            }
        });
    });

    describe('TODO', function () {

        // this.retries(2);

        beforeEach(function () {
            // browser.switchTab ensures we are running all tests on the same tab
            // especially as we have experienced extensions like Skype that open a welcome page in a new tab
            browser.switchTab(tabId);
            browser.logger.info(browser.getUrl());
        });

        it('should have the right title', function () {
            var title = browser.getTitle();
            expect(title).to.equal('Kidoju.Mobile');
        });

        it('should have the right title - the fancy generator way', function () {
            var title = browser.getTitle();
            expect(title).to.equal('Kidoju.Mobile');
        });

    });
});
