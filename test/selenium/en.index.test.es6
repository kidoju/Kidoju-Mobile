/**
 * Copyright (c) 2013-2019 Memba Sarl. All rights reserved.
 * Sources at https://github.com/Memba
 */

/* globals browser: false, $: false */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const logger = require('@wdio/logger').default('test');

// Enhance browser with our Ex functions
require('../_misc/selenium.util.es6');

// const WAIT = 2000;
const SCREEN = {
    HEIGHT: 800,
    WIDTH: 1280
};

/**
 * Test suite
 */
describe('Kidoju Mobile', () => {
    // let tabId;

    before(() => {
        /*
        if (browser.desiredCapabilities.browserName === 'firefox') {
            // This prevents `No such content frame; perhaps the listener was not registered?`
            browser.pause(200);
        }
        */

        browser.url('/index.html');

        // tabId = browser.getCurrentTabId();

        // Note: it won't work in PhantomJS without setting the window size
        browser.setWindowSizeEx(SCREEN.WIDTH, SCREEN.HEIGHT);

        // Now load our $.ajax mockup scripts
        browser.loadScriptEx('./js/app.rapi.mock.js');
    });

    it('should have the right title', () => {
        // TODO Consider the page object patterm
        logger.info(browser.getUrl());
        expect(browser.getTitle()).to.equal('Kidoju.Mobile');
        expect($('body').isExisting()).to.be.true;
    });
});
