/**
 * Copyright (c) 2013-2018 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* jshint node: true, mocha: true, expr: true */
/* globals browser: false, document: false */

'use strict';

var expect = require('chai').expect;
// var util = require('util');

var WAIT = 2000;
var SCREEN = { // iPhone 5
    HEIGHT: 568,
    WIDTH: 320
};

/**
 * Enhance browser with our Ex functions
 */
require('./selenium');

describe('Kidoju Mobile', function () {

    var tabId;

    before(function () {
        if (browser.desiredCapabilities.browserName === 'firefox') {
            // This prevents `No such content frame; perhaps the listener was not registered?`
            browser.pause(200);
        }
        browser.url('/index.html');
        tabId = browser.getCurrentTabId();
        // Note: it won't work in PhantomJS without setting the window size
        browser.windowHandleSize({ height: SCREEN.HEIGHT, width: SCREEN.WIDTH });
        // Now load our $.ajax mockup scripts
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
        // TODO: call reset to load JSON files into database
    });

    describe('TODO', function () {

        // Retry all tests in this suite up to 3 times
        this.retries(3);

        beforeEach(function () {
            // browser.switchTab ensures we are running all tests on the same tab
            // especially as we have experienced extensions like Skype that open a welcome page in a new tab
            browser.switchTab(tabId);
            browser.logger.info(browser.getUrl());
        });

        it('should have the right title', function () {
            // TODO COnsider the page object patterm
            var title = browser.getTitle();
            expect(title).to.equal('Kidoju.Mobile');
        });

    });
});
